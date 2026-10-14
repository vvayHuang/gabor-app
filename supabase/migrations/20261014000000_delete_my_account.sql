-- R05: let a signed-in user delete their own account from inside the app
-- (App Store Review Guideline 5.1.1(v)).
--
-- The client calls supabase.rpc('delete_my_account'). The function removes the caller's
-- game data and then the auth user itself. Deleting from auth.users needs more rights than
-- the caller has, so the function runs as its owner (security definer), but it only ever
-- touches rows of auth.uid(), so a user can never delete someone else.
--
-- Supabase removes the user's identities and sessions together with the auth user.
-- The access token the app still holds stays valid until it expires, but there is no
-- user behind it any more; the app signs out right after the call.
--
-- Apply once in the Supabase SQL Editor. Safe to re-run.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user uuid := auth.uid();
begin
    if v_user is null then
        raise exception 'delete_my_account requires an authenticated user' using errcode = '28000';
    end if;

    -- Game data first, so this works whether or not the foreign keys cascade.
    delete from public.game_sessions where user_id = v_user;
    delete from public.game_stats where user_id = v_user;
    -- profiles (profiles_id_fkey -> auth.users) is not used by the app, but it still
    -- blocks deleting the auth user unless its foreign key cascades.
    delete from public.profiles where id = v_user;

    delete from auth.users where id = v_user;
end;
$$;

revoke all on function public.delete_my_account() from public;
revoke all on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;

notify pgrst, 'reload schema';
