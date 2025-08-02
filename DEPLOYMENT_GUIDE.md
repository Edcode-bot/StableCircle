# StableCircle - Cloud Deployment Guide

This guide will help you deploy your StableCircle React.js application to external cloud hosting platforms like Vercel, Netlify, or similar services that support static site hosting with serverless functions.

## 📋 Prerequisites

- GitHub account
- Cloud hosting platform account (Vercel recommended)
- OpenAI API key (optional, for chatbot functionality)

## 🏗️ Project Structure

The project has been restructured for cloud deployment:

```
├── api/
│   └── chat.ts                 # Serverless function for AI chatbot
├── client/                     # React frontend source
├── dist/public/               # Build output (generated)
├── vercel.json                # Deployment configuration
└── package.json               # Dependencies and build scripts
```

## 🚀 Deployment Steps

### Step 1: Export to GitHub Repository

1. **Create a new GitHub repository:**
   ```bash
   # On GitHub.com, click "New Repository"
   # Name it "stablecircle" or your preferred name
   # Make it public or private as needed
   ```

2. **Clone and push your code:**
   ```bash
   # Clone your new empty repository
   git clone https://github.com/yourusername/stablecircle.git
   cd stablecircle
   
   # Copy all project files to this directory
   # (Copy everything except .git, node_modules, and dist folders)
   
   # Initialize and push
   git add .
   git commit -m "Initial commit: StableCircle dApp"
   git push origin main
   ```

### Step 2: Deploy to Vercel (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your StableCircle repository

2. **Configure Environment Variables:**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add the following variables:
     ```
     OPENAI_API_KEY = your_openai_api_key_here
     ```

3. **Deploy:**
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy" to start the build process
   - Your app will be available at `https://your-project-name.vercel.app`

### Step 3: Alternative Platforms

#### Netlify Deployment:
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist/public`
4. Add environment variables in Site Settings
5. For serverless functions, move `api/` folder to `netlify/functions/`

#### Other Platforms:
- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist/public`
- **Serverless Functions**: Place in platform-specific function directory

## ⚙️ Configuration Details

### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "../dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Environment Variables Required
- `OPENAI_API_KEY`: Your OpenAI API key for the chatbot functionality (optional)

### Build Process
1. **Frontend Build**: Vite compiles React app to `dist/public/`
2. **Serverless Functions**: API endpoints are deployed as individual functions
3. **Static Assets**: Images, CSS, and JS files are served from CDN
4. **Routing**: All non-API routes serve the React app, API routes go to functions

## 🔧 Development vs Production

### Development (Current Setup)
- Express server handles both frontend and API
- Hot module reloading with Vite
- Single server for everything

### Production (Cloud Deployment)
- Static files served from CDN
- API endpoints as serverless functions
- Automatic scaling and global distribution
- No server maintenance required

## 🎯 Features Included

✅ **Frontend Features:**
- SEO-optimized landing page
- Responsive mobile-first design
- Real Celo blockchain integration
- Wallet connection (MetaMask, Valora)
- Group savings functionality
- Referral and rewards system

✅ **Backend Features:**
- AI chatbot with OpenAI integration
- Serverless API architecture
- CORS handling for cross-origin requests
- Error handling and fallback responses

✅ **Production Features:**
- Automatic HTTPS
- Global CDN distribution
- Automatic scaling
- Environment variable management
- Git-based deployment workflow

## 🚨 Important Notes

### Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Enable HTTPS on your domain (automatic with most platforms)

### Performance
- Static assets are cached and served from CDN
- Serverless functions cold start ~100-500ms first time
- Subsequent requests are much faster

### Monitoring
- Most platforms provide built-in analytics
- Monitor function execution time and errors
- Set up alerts for failures

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check all dependencies are in package.json
   - Ensure TypeScript types are correctly installed
   - Verify build command in platform settings

2. **API Functions Not Working:**
   - Check environment variables are set
   - Verify function timeout settings (30s max recommended)
   - Check function logs in platform dashboard

3. **Routing Issues:**
   - Ensure `vercel.json` routes are configured correctly
   - Check that all non-API routes redirect to index.html
   - Verify API routes start with `/api/`

4. **CORS Errors:**
   - API functions include proper CORS headers
   - Check that frontend makes requests to relative URLs

### Getting Help:
- Check platform documentation (Vercel Docs, Netlify Docs)
- Review build logs in platform dashboard
- Test API endpoints directly in browser or Postman

## 📈 Next Steps After Deployment

1. **Custom Domain**: Add your own domain in platform settings
2. **Analytics**: Set up Google Analytics or platform analytics
3. **Monitoring**: Configure error tracking (Sentry, etc.)
4. **CI/CD**: Set up automated testing before deployment
5. **Performance**: Enable compression and caching optimizations

## 🤝 Support

If you encounter issues during deployment:
1. Check the platform's status page
2. Review build logs for specific error messages  
3. Consult platform documentation
4. Contact platform support if needed

---

**Congratulations!** Your StableCircle dApp is now ready for global deployment on modern cloud infrastructure. 🚀