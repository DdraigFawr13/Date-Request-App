-- Moonpost short links. Each invitation is stored under a random 8-character
-- code; the page calls create_invite / get_invite with the public key, and
-- nothing else is reachable: the table has RLS on and no policies.

create table if not exists public.invites (
  code text primary key,
  data text not null check (length(data) <= 6000),
  created_at timestamptz not null default now()
);

alter table public.invites enable row level security;
revoke all on public.invites from anon, authenticated;

create or replace function public.create_invite(data text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  bytes bytea;
  new_code text;
begin
  if data is null or length(data) = 0 or length(data) > 6000 or data !~ '^[jyz][A-Za-z0-9_-]+$' then
    raise exception 'invalid invitation';
  end if;
  loop
    bytes := extensions.gen_random_bytes(8);
    new_code := '';
    for i in 0..7 loop
      new_code := new_code || substr(alphabet, (get_byte(bytes, i) % 62) + 1, 1);
    end loop;
    begin
      insert into public.invites (code, data) values (new_code, create_invite.data);
      return new_code;
    exception when unique_violation then
      -- vanishingly rare; pick another code
    end;
  end loop;
end;
$$;

create or replace function public.get_invite(code text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select i.data from public.invites i where i.code = get_invite.code;
$$;

revoke all on function public.create_invite(text) from public;
revoke all on function public.get_invite(text) from public;
grant execute on function public.create_invite(text) to anon;
grant execute on function public.get_invite(text) to anon;
-- Supabase grants new functions to signed-in users too; this app has none.
revoke execute on function public.create_invite(text) from authenticated;
revoke execute on function public.get_invite(text) from authenticated;
