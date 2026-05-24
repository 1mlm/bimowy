<div align="center">
⚠️ Beta ⚠️
</div>

![banner](https://github.com/user-attachments/assets/36dbcc37-5543-4bc3-bbfa-fa34f9b4bb09)

# <img width="22" alt="icon" src="https://github.com/user-attachments/assets/c6f36d46-675a-4e8e-92c3-88f9566d42fa" /> PluriHub

## Concept

Static exercise books suck. PluriHub is an attempt at making learning resources that are actually dynamic — exercises generate new numbers every time, UI adapts to the content, and the correction logic lives alongside the exercise itself.

Under the hood, resources are described using a small node-based system (think visual scripting, but stored as JSON). The platform interprets these graphs at runtime to generate seeds, render UIs, and check answers. The goal is to eventually support way more than just math — physics, code, logic, whatever can be expressed as a graph.

## Run locally

**Requirements:** Node.js 20+, PostgreSQL

```bash
git clone https://github.com/bimoware/bimowy
cd bimowy
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `BETTER_AUTH_SECRET` — random string, generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` — your local dev URL (e.g. `http://localhost:3008`)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — create an OAuth app at [github.com/settings/developers](https://github.com/settings/developers), set the callback URL to `{BETTER_AUTH_URL}/api/auth/callback/github`

Then set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

> By default connects to `postgresql://postgres:postgres@localhost:5432/plurihub-db`. Override with `DB_NAME` or `DATABASE_URL` in `.env`.
