-- D01 follow-up: sync the ability difficulty level (1-100) across devices.
--
-- Unlike XP, the difficulty goes up and down, so it cannot be added or max()-ed.
-- The client sends its latest value together with the time it was set, and the
-- server keeps whichever side was set most recently:
--   * difficulty_level: null until the user finishes a game on a client that syncs it
--     (the client then falls back to the XP level as the starting point)
--   * difficulty_updated_at: when that value was set, capped at the server's now()
--     so a device with a fast clock cannot lock the value
--
-- This replaces increment_stats from 20261007000000_increment_stats.sql with a version
-- that takes two extra optional parameters. Everything else in the function is unchanged,
-- and older clients that do not send the new parameters keep working.
--
-- Apply once in the Supabase SQL Editor. Safe to re-run.

alter table public.game_stats
    add column if not exists difficulty_level integer,
    add column if not exists difficulty_updated_at timestamptz;

-- Adding parameters creates a second overload instead of replacing the old one,
-- which would make calls without the new parameters ambiguous. Drop the old signature first.
drop function if exists public.increment_stats(integer, integer, integer, integer, integer, integer, text, jsonb);

create or replace function public.increment_stats(
    p_xp integer default 0,
    p_minutes integer default 0,
    p_sessions integer default 0,
    p_high_score integer default 0,
    p_longest_streak integer default 0,
    p_current_streak integer default 0,
    p_last_played_date text default '',
    p_achievements jsonb default '{}'::jsonb,
    p_difficulty_level integer default null,
    p_difficulty_updated_at timestamptz default null
)
returns public.game_stats
language plpgsql
security invoker
set search_path = public
as $$
declare
    v_user uuid := auth.uid();
    v_row public.game_stats%rowtype;
    v_xp integer := coalesce(p_xp, 0);
    v_minutes integer := coalesce(p_minutes, 0);
    v_sessions integer := coalesce(p_sessions, 0);
    v_new_date text := left(coalesce(p_last_played_date, ''), 10);
    v_old_date text;
    v_old_ach jsonb;
    v_new_ach jsonb := coalesce(p_achievements, '{}'::jsonb);
    v_merged jsonb;
    v_difficulty_at timestamptz := least(p_difficulty_updated_at, now());
begin
    if v_user is null then
        raise exception 'increment_stats requires an authenticated user' using errcode = '28000';
    end if;

    if v_xp < 0 or v_minutes < 0 or v_sessions < 0 then
        raise exception 'increment_stats only accepts non-negative increments' using errcode = '22023';
    end if;

    -- Make sure the row exists, then lock it so concurrent calls from two devices queue up.
    insert into public.game_stats (user_id) values (v_user)
    on conflict (user_id) do nothing;

    select * into v_row
    from public.game_stats
    where user_id = v_user
    for update;

    v_old_date := left(coalesce(v_row.last_played_date::text, ''), 10);
    v_old_ach := coalesce(to_jsonb(v_row.achievements), '{}'::jsonb);

    if jsonb_typeof(v_old_ach) <> 'object' then
        v_old_ach := '{}'::jsonb;
    end if;
    if jsonb_typeof(v_new_ach) <> 'object' then
        v_new_ach := '{}'::jsonb;
    end if;

    -- Badge values are 'level-1' .. 'level-5', so max() on the text picks the higher badge.
    select coalesce(jsonb_object_agg(merged.day, merged.badge), '{}'::jsonb)
    into v_merged
    from (
        select entries.key as day, max(entries.value) as badge
        from (
            select key, value from jsonb_each_text(v_old_ach)
            union all
            select key, value from jsonb_each_text(v_new_ach)
        ) as entries
        group by entries.key
    ) as merged;

    v_row.total_xp := coalesce(v_row.total_xp, 0) + v_xp;
    v_row.total_time_minutes := coalesce(v_row.total_time_minutes, 0) + v_minutes;
    v_row.total_sessions := coalesce(v_row.total_sessions, 0) + v_sessions;
    v_row.high_score := greatest(coalesce(v_row.high_score, 0), coalesce(p_high_score, 0));
    v_row.consecutive_days := greatest(coalesce(v_row.consecutive_days, 0), coalesce(p_longest_streak, 0));
    -- Same formula as the client: level = floor(sqrt(totalXP / 100)) + 1
    v_row.current_level := floor(sqrt(v_row.total_xp / 100.0)) + 1;
    v_row.achievements := v_merged;

    if v_new_date <> '' and v_new_date >= v_old_date then
        v_row.current_streak := coalesce(p_current_streak, 0);
        v_row.last_played_date := v_new_date;
    end if;

    -- Difficulty: the most recently set value wins. Same range as the client (1-100).
    if p_difficulty_level is not null and v_difficulty_at is not null
        and (v_row.difficulty_updated_at is null or v_difficulty_at > v_row.difficulty_updated_at) then
        v_row.difficulty_level := greatest(1, least(100, p_difficulty_level));
        v_row.difficulty_updated_at := v_difficulty_at;
    end if;

    update public.game_stats
    set total_xp = v_row.total_xp,
        total_time_minutes = v_row.total_time_minutes,
        total_sessions = v_row.total_sessions,
        high_score = v_row.high_score,
        consecutive_days = v_row.consecutive_days,
        current_level = v_row.current_level,
        current_streak = v_row.current_streak,
        last_played_date = v_row.last_played_date,
        achievements = v_row.achievements,
        difficulty_level = v_row.difficulty_level,
        difficulty_updated_at = v_row.difficulty_updated_at,
        updated_at = now()
    where user_id = v_user
    returning * into v_row;

    return v_row;
end;
$$;

revoke all on function public.increment_stats(integer, integer, integer, integer, integer, integer, text, jsonb, integer, timestamptz) from public;
revoke all on function public.increment_stats(integer, integer, integer, integer, integer, integer, text, jsonb, integer, timestamptz) from anon;
grant execute on function public.increment_stats(integer, integer, integer, integer, integer, integer, text, jsonb, integer, timestamptz) to authenticated;

-- Let PostgREST pick up the new columns and function without waiting for its cache to expire.
notify pgrst, 'reload schema';
