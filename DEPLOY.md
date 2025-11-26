# How to Publish Grocify

Since this is a static website (HTML/CSS/JS), the easiest way to publish it for free is using **Netlify Drop**.

## Option 1: Netlify Drop (Recommended)

1.  I have created a file named **`grocify.zip`** in your workspace.
2.  Open [Netlify Drop](https://app.netlify.com/drop) in your browser.
3.  Drag and drop the `grocify.zip` file onto the page.
4.  Netlify will instantly publish your site and give you a live URL (e.g., `https://random-name.netlify.app`).

## Option 2: GitHub Pages

1.  Create a new repository on GitHub.
2.  Upload `index.html`, `style.css`, and `app.js`.
3.  Go to **Settings** > **Pages**.
4.  Select the `main` branch and click **Save**.
5.  Your site will be live at `https://your-username.github.io/repo-name`.

## Option 3: Vercel

1.  Install Vercel CLI: `npm i -g vercel` (if you have Node.js installed).
2.  Run `vercel` in this folder and follow the prompts.
