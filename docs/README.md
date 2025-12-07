# LeetParse Landing Page

This is the official landing page for LeetParse, hosted on GitHub Pages.

## 🌐 Live Site

Visit: [Your GitHub Pages URL]

## 📁 Structure

```
docs/
├── index.html          # Main landing page
├── styles.css          # Stylesheet
├── script.js           # JavaScript interactions
├── assets/             # Images and media files
│   └── hero-screenshot.png  # Add your screenshots here
├── _config.yml         # GitHub Pages configuration
└── CNAME              # Custom domain (optional)
```

## 🚀 Deployment

### Automatic Deployment (GitHub Pages)

1. Push changes to the `main` branch
2. GitHub Pages will automatically build and deploy from the `docs/` folder
3. Your site will be live at: `https://yourusername.github.io/leetcode-parser/`

### Setting up GitHub Pages

1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/docs`
4. Click "Save"
5. Your site will be published at the URL shown

### Custom Domain (Optional)

If you have a custom domain (e.g., leetparse.com):

1. Update the `CNAME` file with your domain
2. Add DNS records at your domain provider:
   - For apex domain: Add A records pointing to GitHub Pages IPs
   - For subdomain: Add CNAME record pointing to `yourusername.github.io`
3. Enable "Enforce HTTPS" in repository settings

## 📝 Customization

### Update Links

Replace placeholder links in `index.html`:

- Chrome Web Store URL
- VS Code Marketplace URL
- GitHub repository URL
- Email address

### Add Demo Video

1. Upload your demo video to YouTube or host it directly
2. Replace the video placeholder in `index.html` with:

```html
<iframe 
    width="100%" 
    height="100%" 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
    frameborder="0" 
    allowfullscreen>
</iframe>
```

### Add Screenshots

1. Add screenshots to `docs/assets/` folder
2. Update image sources in `index.html`:
   - `hero-screenshot.png` - Main hero image
   - Additional feature screenshots

### Update Analytics

Add Google Analytics tracking ID in `_config.yml` and update the tracking code in `script.js`.

## 🎨 Design

The landing page features:

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive**: Fully responsive design for all devices
- **Interactive**: Smooth scrolling, animations, and hover effects
- **Performance**: Optimized loading and intersection observers
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🛠️ Local Development

To test locally:

1. Open `index.html` in your browser
2. Or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server docs/

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📱 Sections

The landing page includes:

1. **Navigation** - Quick access to all sections
2. **Hero** - Eye-catching introduction with CTAs
3. **Features** - Showcase of 9 key features
4. **Demo** - Video demonstration and step-by-step guide
5. **Download** - Installation instructions for both extensions
6. **Roadmap** - Product development timeline
7. **Testimonials** - User reviews and feedback
8. **CTA** - Final call-to-action
9. **Contact** - Multiple contact options
10. **Footer** - Links and additional information

## 🔧 Maintenance

### Regular Updates

- Keep feature descriptions current
- Update roadmap quarterly
- Add new testimonials
- Update download links
- Refresh screenshots

### Performance

- Optimize images (use WebP format)
- Minify CSS and JS for production
- Enable caching headers
- Monitor Core Web Vitals

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions to improve the landing page are welcome! Please open an issue or pull request.

---

Made with ❤️ by Sarvesh
