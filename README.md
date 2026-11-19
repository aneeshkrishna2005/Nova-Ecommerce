# NOVA Commerce V3

A React + Vite storefront and Express + SQLite API, upgraded from NOVA V2.

## V3 additions
- Dedicated product detail page with product information, stock/rating, add-to-bag, and same-category recommendations.
- Stripe Checkout for international card payments (test/live credentials supported).
- Razorpay Checkout for India (UPI, cards, netbanking and supported wallets), with server-side signature verification.
- Floating Nova AI shopping assistant, backed by a Groq/OpenAI-compatible chat API. The assistant receives the live product catalogue as context.
- Existing authentication, cart, coupons, customer account, order history, admin dashboard and inventory tools retained.

## Requirements
- Node.js 18 or newer
- npm

## Run on Windows
1. Extract the ZIP and open the `nova-commerce-v3` folder in VS Code.
2. Open a terminal in that folder and run `npm install`.
3. Copy `.env.example` to `.env` and update the secrets (see below).
4. Start both servers with `npm run dev`.
5. Open http://localhost:5173. The API runs at http://localhost:4000.

If PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`.

## Payment setup
**Stripe:** Create Stripe API keys and put the secret key in `STRIPE_SECRET_KEY`. Configure a webhook endpoint at `https://YOUR_PUBLIC_API_HOST/api/stripe/webhook` for `checkout.session.completed`, then set `STRIPE_WEBHOOK_SECRET`. Stripe test cards and live payments are controlled by the Stripe account mode. The current checkout uses USD amounts.

**Razorpay:** From the Razorpay Dashboard, create API keys and set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Start with test keys. The app creates INR orders; `USD_TO_INR_RATE` controls the conversion from the catalogue's USD prices (default 83; set an up-to-date rate before use). Razorpay signature verification is performed on the server before an order is recorded. Switch to live keys only after testing and completing your account's required activation/compliance steps.

Never put gateway secrets in React/Vite environment variables or commit `.env` to source control.

## Nova AI setup
Create a Groq API key and set `AI_API_KEY`, `AI_BASE_URL=https://api.groq.com/openai/v1/chat/completions`, and `AI_MODEL=llama-3.3-70b-versatile`. You can use another OpenAI-compatible provider by changing the base URL and model. Without a key, the chat widget explains how to enable live AI and remains available as a UI demo.

## Admin
Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a strong random `JWT_SECRET` in `.env` before first run. The initial admin account is bootstrapped on server startup if it does not exist.

## Important production checklist
This is a development starter, not a certified production commerce platform. Before accepting real customer payments: use HTTPS, configure trusted CORS origins, add rate limiting and request validation, protect admin bootstrap credentials, implement robust payment reconciliation/webhooks and refund handling, test inventory race conditions, configure backups/monitoring, and complete privacy/tax/shipping/legal requirements. Do not deploy with demo credentials or test gateway keys.
