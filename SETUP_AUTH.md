# Google Auth & Favorites Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

### Required variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database path (default: `file:./dev.db`) |
| `AUTH_SECRET` | Secret for encrypting tokens. Generate with: `npx auth secret` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |

### Get Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select existing)
3. **OAuth consent screen** (required first): Go to **OAuth consent screen** → choose **External** → fill in app name, support email, developer contact → Save. If app is in "Testing", add your email under **Test users**.
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Under **Authorized redirect URIs**, add exactly: `http://localhost:3000/api/auth/callback/google` (for production, add `https://yourdomain.com/api/auth/callback/google`)
7. Copy the Client ID and Client Secret into `.env.local` as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`

## 3. Initialize the database

```bash
npx prisma db push
```

This creates the SQLite database and tables (User, Account, Session, Favorite, etc.).

## 4. Run the app

```bash
npm run dev
```

## How it works

- **Signed out**: Favorites are stored in `localStorage` (browser-only)
- **Signed in with Google**: Favorites are saved to the SQLite database and synced across devices
- The **Sign in** button appears in the top-right corner
- After signing in, all new favorites are stored server-side
