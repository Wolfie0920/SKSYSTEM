KK-SK Portal
Open home.html through a web server (for example: python3 -m http.server, then visit http://localhost:8000/home.html)
or upload the whole folder to Netlify / Cloudflare Pages / GitHub Pages.

Pages: home, kk-assembly, resolutions, kabataan, projects, open-forum, reports, chat, kk-profiling, sk-settings, profile.
Each has its own .html and its own css/<page>.css. Shared styles: css/base.css. Shared logic: js/app.js.

Demo mode (no Supabase): log in with chair@demo.ph / sk123456.
Go live: run supabase-setup.sql in Supabase, then paste your URL and anon key into SB_URL and SB_KEY at the top of the
Supabase section in js/app.js.

SK Chairperson (super admin): sign up on the site, then in Supabase SQL Editor run:
  update members set role='chair', pos='SK Chairperson', status='active' where email='YOUR EMAIL';
Council members then choose 'SK council member' when they sign up, and you approve them on the Approvals page.
