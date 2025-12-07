# LeetParse - Deployment Guide

## 🚀 Quick Start: Deploy to GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Sarvesh0955/leetcode-parser`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/docs`
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Your site will be live at: `https://sarvesh0955.github.io/leetcode-parser/`

### Step 2: Update Links in index.html

Before deployment, update these placeholder links in `docs/index.html`:

```html
<!-- Replace these URLs with actual ones -->
<a href="YOUR_CHROME_WEBSTORE_URL">Add to Chrome</a>
<a href="YOUR_VSCODE_MARKETPLACE_URL">VS Code Extension</a>
<a href="YOUR_GITHUB_REPO_URL">View on GitHub</a>
```

**Find and Replace:**
- `https://chromewebstore.google.com/detail/leetparse/lenebbdagjnijnjobankmhoagffiiial` → Your actual Chrome extension URL
- `https://marketplace.visualstudio.com/items?itemName=Sarvesh0955.cph-leetparse` → Your actual VS Code extension URL
- `https://github.com/Sarvesh0955/leetcode-parser` → (Keep or update if different)

### Step 3: Add Screenshots

1. Take screenshots of your extension in action
2. Save them in `docs/assets/` folder:
   - `hero-screenshot.png` (main hero image)
   - `feature-1.png`, `feature-2.png`, etc. (optional)
3. Update image paths in `index.html` if needed

### Step 4: Add Demo Video (Optional but Recommended)

**Option A: YouTube Video**
1. Upload your demo video to YouTube
2. In `index.html`, replace the video placeholder:

```html
<div class="video-container">
    <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        title="LeetParse Demo"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="border-radius: var(--radius-xl);">
    </iframe>
</div>
```

**Option B: Loom/Vimeo**
Similar to YouTube, replace with your video embed code.

### Step 5: Custom Domain (Optional)

If you want to use `leetparse.com` instead of GitHub Pages URL:

1. **Purchase domain** from a registrar (GoDaddy, Namecheap, etc.)

2. **Update CNAME file:**
   ```bash
   # In docs/CNAME file
   leetparse.com
   ```

3. **Configure DNS at your domain provider:**
   
   Add these A records for apex domain:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   
   OR add CNAME record for subdomain (www):
   ```
   www.leetparse.com → sarvesh0955.github.io
   ```

4. **Enable HTTPS:**
   - In GitHub repository settings → Pages
   - Check "Enforce HTTPS"

5. Wait 24-48 hours for DNS propagation

## 📝 Pre-Deployment Checklist

- [ ] Update all placeholder URLs in `index.html`
- [ ] Add screenshots to `docs/assets/` folder
- [ ] Update image sources in HTML
- [ ] Add demo video (YouTube/Loom)
- [ ] Update email in contact section
- [ ] Test locally before pushing
- [ ] Update `_config.yml` with correct repository name
- [ ] Add Google Analytics ID (optional)
- [ ] Verify all external links work
- [ ] Check mobile responsiveness

## 🧪 Testing Locally

Before deploying, test the site locally:

```bash
# Navigate to docs folder
cd docs

# Start local server (choose one):

# Python 3
python -m http.server 8000

# Node.js
npx http-server .

# PHP
php -S localhost:8000
```

Visit: `http://localhost:8000`

## 🔄 Updating the Site

After making changes:

```bash
# 1. Make your changes to files in docs/ folder

# 2. Test locally (optional but recommended)
cd docs && python -m http.server 8000

# 3. Commit and push
git add docs/
git commit -m "Update landing page"
git push origin main

# 4. GitHub Pages will automatically rebuild (2-3 minutes)
```

## 📊 Analytics Setup (Optional)

### Google Analytics

1. Create a GA4 property at `https://analytics.google.com`
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to `docs/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎨 Customization Tips

### Colors
Edit CSS variables in `docs/styles.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change to your brand color */
    --secondary-color: #ec4899;
}
```

### Fonts
Currently using Inter from Google Fonts. To change:
```html
<!-- In index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
/* In styles.css */
--font-family: 'Your Font', sans-serif;
```

### Add More Sections
Copy any existing section structure and modify content.

## 🐛 Troubleshooting

### Site Not Loading
- Check GitHub Pages settings are correct
- Verify `docs/` folder is selected
- Wait 5-10 minutes after enabling
- Check repository is public

### CSS/JS Not Working
- Verify file paths are correct
- Check browser console for errors
- Clear browser cache

### Images Not Showing
- Verify images are in `docs/assets/`
- Check file paths in HTML
- Ensure image files are committed to git

### Custom Domain Issues
- Verify DNS records are correct
- Wait 24-48 hours for DNS propagation
- Check CNAME file has correct domain
- Ensure HTTPS is enforced

## 📱 SEO Optimization

### Add to index.html:

```html
<head>
    <!-- ... existing tags ... -->
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://leetparse.com/">
    <meta property="og:title" content="LeetParse - Your LeetCode Companion">
    <meta property="og:description" content="Parse LeetCode problems instantly and export to VS Code. Multi-language support for competitive programming.">
    <meta property="og:image" content="https://leetparse.com/assets/hero-screenshot.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://leetparse.com/">
    <meta property="twitter:title" content="LeetParse - Your LeetCode Companion">
    <meta property="twitter:description" content="Parse LeetCode problems instantly and export to VS Code. Multi-language support for competitive programming.">
    <meta property="twitter:image" content="https://leetparse.com/assets/hero-screenshot.png">
</head>
```

## 🔗 Useful Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Web.dev - Performance](https://web.dev/measure/)

## 📞 Need Help?

If you encounter issues:
1. Check the GitHub Pages build status in repository Actions tab
2. Review browser console for JavaScript errors
3. Verify all file paths are correct
4. Open an issue on the repository

---

**Next Steps:**
1. Follow Step 1 to enable GitHub Pages
2. Update all URLs in index.html
3. Add screenshots and demo video
4. Push changes and visit your live site!

Good luck with your launch! 🚀
