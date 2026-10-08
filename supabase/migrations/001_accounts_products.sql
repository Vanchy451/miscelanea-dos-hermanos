begin;

create table public.administradores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.administradores enable row level security;
revoke all on public.administradores from anon, authenticated;

create function public.es_administrador() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.administradores where user_id = (select auth.uid())); $$;
revoke all on function public.es_administrador() from public;
grant execute on function public.es_administrador() to authenticated;

create table public.perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '' check (length(nombre) <= 200),
  telefono text not null default '' check (length(telefono) <= 20),
  created_at timestamptz not null default now()
);
alter table public.perfiles enable row level security;
grant select, insert, update on public.perfiles to authenticated;
create policy perfil_propio on public.perfiles for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nombre text not null check (length(trim(nombre)) between 1 and 200),
  categoria text not null check (length(trim(categoria)) between 1 and 100),
  precio_centavos integer not null check (precio_centavos >= 0),
  stock integer not null default 0 check (stock >= 0),
  imagen text check (imagen is null or (imagen like 'https://%' and length(imagen) <= 2000)),
  activo boolean not null default true,
  updated_at timestamptz not null default now()
);
create index productos_categoria on public.productos(categoria);
alter table public.productos enable row level security;
grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
create policy productos_visibles on public.productos for select to anon, authenticated using (activo);
create policy productos_admin on public.productos for all to authenticated
using ((select public.es_administrador())) with check ((select public.es_administrador()));

create table public.productos_auditoria (
  id bigint generated always as identity primary key,
  producto_id uuid not null,
  administrador_id uuid,
  operacion text not null,
  anterior jsonb,
  nuevo jsonb,
  created_at timestamptz not null default now()
);
alter table public.productos_auditoria enable row level security;
revoke all on public.productos_auditoria from anon, authenticated;
grant select on public.productos_auditoria to authenticated;
create policy auditoria_admin on public.productos_auditoria for select to authenticated using ((select public.es_administrador()));

create function public.actualizar_fecha_producto() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger producto_fecha before update on public.productos for each row execute function public.actualizar_fecha_producto();

create function public.auditar_producto() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.productos_auditoria(producto_id, administrador_id, operacion, anterior, nuevo)
  values (coalesce(new.id, old.id), auth.uid(), tg_op,
    case when tg_op <> 'INSERT' then to_jsonb(old) else null end,
    case when tg_op <> 'DELETE' then to_jsonb(new) else null end);
  return coalesce(new, old);
end; $$;
revoke all on function public.auditar_producto() from public;
create trigger producto_auditoria after insert or update or delete on public.productos for each row execute function public.auditar_producto();

commit;
