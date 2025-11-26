Local SQLite DB (dev)

What I added
- `server/db.ts` – creates `data/store.db` using `better-sqlite3` and exposes a Drizzle wrapper.
- `server/dbStorage.ts` – DB-backed implementation of the app storage (CRUD for products/borrowed/reminders).
- `server/storage.ts` – now conditionally uses DB storage when `USE_DB` environment variable is set.
- `package.json` – added `better-sqlite3` to `optionalDependencies` so the project can use SQLite locally.

How to use (Windows / PowerShell)
1) Install dependencies:

```powershell
npm install
```

2) Enable the DB-backed storage and start the dev server:

```powershell
# optional: allow local scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# enable DB usage
$env:USE_DB = "1"
$env:NODE_ENV = "development"

# run server using local tsx binary
.
\node_modules\.bin\tsx server/index.ts
```

3) The first run will create `data/store.db` and the necessary tables. The server will serve at `http://localhost:5000` by default.

Notes & caveats
- `better-sqlite3` is a native module; on some Windows installations it may need a compatible prebuilt binary or build tools.
  - If `npm install` fails when installing `better-sqlite3`, you can either:
    - Run without DB (leave `USE_DB` unset) which will keep using the in-memory store, or
    - Use a local PostgreSQL instance and configure the app to use Postgres (the project already contains Postgres-flavored schema in `shared/schema.ts`).
- The DB-backed storage stores dates as ISO strings and converts them to `Date` objects when returning data to the app.

If you want, I can:
- Add a small `npm` script `dev:db` that sets `USE_DB` and starts the server in a Windows-friendly way, or
- Add a seed script to pre-populate sample products.
