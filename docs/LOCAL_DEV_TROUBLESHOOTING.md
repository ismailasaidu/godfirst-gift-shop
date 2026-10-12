# Local development troubleshooting

## Start the combined Vite + Netlify server

1. Open a terminal in the folder containing `package.json`.
2. Install dependencies once with `npm install`.
3. Run `netlify dev`.
4. Open `http://localhost:8888`. The Vite server runs internally on port 5173 and Netlify proxies it on port 8888 while exposing functions.

The `netlify.toml` includes an explicit `[dev]` configuration so Netlify Dev proxies the Vite app. If port 8888 is still returning 404, stop all existing dev servers with Ctrl+C, close old terminal sessions, then run `netlify dev` again from this project root. Check that the terminal says Vite is on port 5173 and Netlify is on port 8888.

Never include `.env` or `.env.local` in a shared ZIP. Keep ImageKit private keys in `.env` only, not in variables prefixed with `VITE_`.
