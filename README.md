# Portfolio — Sri Balaji

A multi-file static portfolio site (HTML/CSS/JS, no build step, no framework).

```
site/
├── index.html      # page structure & content
├── css/
│   └── style.css   # all styling (design tokens, layout, animations, light/dark theme)
├── js/
│   └── main.js     # typing effect, cursor, scroll tracking, canvas background, tilt cards, theme toggle
├── assets/
│   └── img/
│       ├── avatar.jpg        # profile photo (hero + nav)
│       ├── favicon.png       # 192x192 favicon / apple touch icon
│       └── favicon-32.png    # 32x32 favicon
└── README.md
```

## Before you publish

Open `index.html` and confirm the contact details near the bottom (email,
phone, LinkedIn, GitHub) are correct.

## Publish with GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
2. From this `site/` folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. GitHub will publish the site at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
   (this can take a minute or two the first time).

### Using a personal (user/organization) site instead of a project site

If you'd rather have it live at `https://<your-username>.github.io` directly,
name the repository exactly `<your-username>.github.io` in step 1 — GitHub
Pages then publishes automatically from `main` with no extra settings.

## Local preview

Open `index.html` directly in a browser, or serve the folder locally
(recommended, since some browsers restrict local file access for scripts):
```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```
