# Panduan Deploy: Supabase + Railway + Vercel

## Arsitektur
```
[Vercel] Frontend (React/Vite)
    ↓ HTTP requests
[Railway] Backend (Bun + Elysia)
    ↓ SQL
[Supabase] PostgreSQL Database
```

---

## Langkah 1 — Setup Database di Supabase

1. Buka https://supabase.com → **New Project**
2. Isi nama project, password database, pilih region **Singapore**
3. Tunggu project selesai dibuat (~2 menit)
4. Buka **Project Settings → Database → Connection string → URI**, copy string-nya:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Jalankan Migrasi Schema

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" bun run db:push
```

---

## Langkah 2 — Deploy Backend ke Railway

1. Buka https://railway.app → **New Project → Deploy from GitHub repo**
2. Pilih repository ini

### Set Environment Variables

Masuk ke **Service → Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Connection string dari Supabase |
| `PORT` | `3000` |

Setelah deploy, catat URL publik Railway (contoh: `https://personal-knowledge-production.up.railway.app`).

---

## Langkah 3 — Deploy Frontend ke Vercel

1. Buka https://vercel.com → **New Project → Import Git Repository**
2. Pilih repository ini, konfigurasi:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
3. Tambahkan **Environment Variable**:
   - `VITE_API_URL` = URL Railway dari langkah 2
4. Klik **Deploy**

---

## Checklist Final

- [ ] Supabase: schema sudah di-push
- [ ] Railway: `DATABASE_URL` dan `PORT` sudah diset, backend bisa diakses
- [ ] Vercel: `VITE_API_URL` sudah diset ke URL Railway, frontend live

---

## Troubleshooting

**Backend gagal start** — cek logs di Railway, pastikan `DATABASE_URL` benar

**Frontend tidak bisa fetch API** — cek `VITE_API_URL` di Vercel env vars, cek CORS error di browser console

**Database connection error** — Supabase free tier pause setelah 1 minggu tidak aktif, aktifkan kembali di dashboard
