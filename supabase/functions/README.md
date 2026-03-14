# Supabase Edge Functions

Implemented MVP endpoints:

- `create-order`
- `create-shipment`
- `assign-carrier`
- `calculate-rate`
- `track-shipment`
- `upload-document`

Deploy locally:

```bash
supabase functions serve
```

Deploy to hosted Supabase:

```bash
supabase functions deploy create-order
supabase functions deploy create-shipment
supabase functions deploy assign-carrier
supabase functions deploy calculate-rate
supabase functions deploy track-shipment
supabase functions deploy upload-document
```

