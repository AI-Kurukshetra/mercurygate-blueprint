# Local Development Setup

## 1. Create a Supabase Project

```bash
pnpm dlx supabase login
pnpm dlx supabase init
pnpm dlx supabase start
```

Hosted alternative:

1. Create a new project in Supabase.
2. Copy the project URL and anon key.
3. Create a service role key for server-side operations.

## 2. Configure Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Run Database Migrations

```bash
pnpm dlx supabase db reset
```

Or apply to hosted Supabase:

```bash
pnpm dlx supabase db push
```

## 4. Seed Demo Data

```bash
pnpm dlx supabase db reset --seed
```

## 5. Install Dependencies

```bash
pnpm install
```

## 6. Run Next.js Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## 7. Optional: Run Edge Functions Locally

```bash
pnpm dlx supabase functions serve
```

## Demo Auth Setup

Create users in Supabase Auth, then update `public.profiles.role` and `public.profiles.customer_id` as needed:

```sql
update public.profiles
set role = 'ops'
where email = 'ops@mercurylite.com';

update public.profiles
set role = 'customer',
    customer_id = '11111111-1111-1111-1111-111111111111'
where email = 'customer@acme.com';
```

