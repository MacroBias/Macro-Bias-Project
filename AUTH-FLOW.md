## Auth & Session Flow

- **Entry points**
  - Landing header and footer render a CTA that shows **Get Access** for new visitors and **Login** for returning users with a valid session.
  - On **Get Access**, the CTA opens the email capture modal from `components/landing/access-modal.tsx`.
  - On **Login**, the CTA navigates directly to `/app/home`.

- **Registration / access modal**
  - The access modal validates the email and sends a `POST /api/access-request` request.
  - On success, it calls `setSession(email)` from `lib/auth.ts` to store the email and expiry in `localStorage`.
  - The user is then routed to `/app/home` (or `/admin` for admins).

- **Session storage (`lib/auth.ts`)**
  - Session is stored as `{ email, expiresAt }` under the `macro_bias_session` key in `localStorage`.
  - `isSessionValid()` checks that the session exists, contains an email, and is not expired; expired sessions are cleared.
  - `getSessionEmail()` / `getEmail()` read the email from the current session.
  - `logout()` (and `clearSession()`) remove the session from `localStorage`.

- **App protection (`components/auth/auth-guard.tsx`)**
  - All `/app/*` routes are wrapped in `AuthGuard` via `app/app/layout.tsx`.
  - On mount, `AuthGuard`:
    - Returns the user to `/` if the local session is invalid or missing an email.
    - Otherwise calls `POST /api/access-verify` with the stored email.
    - If verification fails, it clears the session and redirects to `/`.
    - If verification succeeds, it renders the app children.

- **Dashboard header (`components/app/app-header.tsx`)**
  - Reads the email from `getEmail()` to show the signed-in user and initials.
  - The **Log out** action calls `logout()` and returns the user to `/`, which causes the landing CTAs to show **Get Access** again.

