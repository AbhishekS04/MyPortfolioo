# ✨ Abhishek Singh | Portfolio

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)
![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

**A modern, progressive web application portfolio with stunning animations and interactive experiences**

[View Demo](https://abhishekkpf.vercel.app) · [Report Bug](https://github.com/AbhishekS04/portfolio/issues) · [Request Feature](https://github.com/AbhishekS04/portfolio/issues)

</div>

---

## 🎯 Overview

This is a cutting-edge portfolio website built for a Product Engineer, showcasing exceptional design, performance, and interactivity. The project demonstrates modern web development practices with a focus on user experience, accessibility, and performance optimization.

Built with **Next.js 16**, **React 19**, and **TypeScript**, this portfolio features smooth animations powered by **Framer Motion**, a custom admin dashboard with **Supabase** integration, and Progressive Web App (PWA) capabilities for an app-like experience on any device.

---

## ✨ Key Features

### 🎨 **Design & UX**
- **Smooth Scroll Experience** - Lenis-powered buttery smooth scrolling
- **Advanced Animations** - Framer Motion for stunning, performant animations
- **3D Interactions** - Interactive tilt effects and perspective transforms
- **Bento Grid Layout** - Modern, responsive card-based design
- **Dark Theme** - Sleek, minimal dark interface with subtle accents
- **Command Palette** - Quick navigation via keyboard shortcuts (⌘K)

### 🚀 **Performance**
- **Code Splitting** - Dynamic imports for optimal bundle sizes
- **Image Optimization** - AVIF/WebP formats with Next.js Image
- **PWA Support** - Offline capabilities and installable app experience
- **Security Headers** - X-Frame-Options, CSP, and other security best practices
- **Lazy Loading** - Below-the-fold content loaded on demand

### 🎮 **Interactive Features**
- **Gaming Profile** - Cyberpunk-themed gaming stats showcase
- **GitHub Integration** - Live contribution graphs and repository stats
- **Dynamic Projects** - Filterable and searchable work portfolio
- **Admin Dashboard** - Full CMS for content management
- **MFA Security** - Two-factor authentication for admin access

### 🎁 **Easter Eggs**
This portfolio contains several hidden interactive features and surprises. Pay attention to details, explore thoroughly, and you might discover something special. *Hint: Sometimes the journey matters as much as the destination.*

---

## 🛠️ Tech Stack

### **Core**
- [Next.js 16.1](https://nextjs.org/) - React framework with App Router
- [React 19.2](https://react.dev/) - UI library
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety

### **Styling**
- [Tailwind CSS 4.1](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion 12](https://www.framer.com/motion/) - Animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide React](https://lucide.dev/) - Beautiful icons

### **Backend & Data**
- [Supabase](https://supabase.com/) - Backend as a Service (Auth, Database)
- [OpenAI API](https://openai.com/) - AI-powered text optimization

### **Infrastructure**
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) - Progressive Web App support
- [Lenis](https://lenis.studiofreight.com/) - Smooth scroll library

---

## 📦 Installation

### **Prerequisites**
- Node.js 20+ and npm/yarn/pnpm
- Git
- A Supabase account (for backend features)

### **Clone Repository**
```bash
git clone https://github.com/AbhishekS04/portfolio.git
cd portfolio
```

### **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

### **Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for AI text optimizer in admin)
OPENAI_API_KEY=your_openai_api_key

# Optional: Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Usage

### **Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Production Build**
```bash
npm run build
npm run start
```

### **Linting**
```bash
npm run lint
```

---

## 📂 Project Structure

```
ppppfffff/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard & auth
│   │   ├── gaming/            # Gaming profile showcase
│   │   ├── works/             # Projects portfolio
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── home/              # Homepage components
│   │   ├── ui/                # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   └── github/            # GitHub integration components
│   └── lib/                   # Utilities and helpers
├── public/                     # Static assets
├── docs/                       # Documentation
└── scripts/                    # Build and utility scripts
```

---

## 🎨 Customization

### **Personal Information**
Update your details in `src/app/about/page.tsx`:
```typescript
const general = {
    full_name: "Your Name",
    role_title: "Your Title",
    bio_description: "Your bio...",
    contact_email: "your@email.com",
    // ... more fields
};
```

### **Metadata & SEO**
Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
    title: "Your Name | Portfolio",
    description: "Your description",
    // ... more metadata
};
```

### **Colors & Theme**
Modify `tailwind.config.ts` for custom color schemes.

---

## 🔐 Admin Features

### **Access Admin Panel**
Navigate to `/admin/login` and authenticate with your Supabase credentials.

### **Setup MFA**
Visit `/admin/mfa-setup` after login to enable two-factor authentication for enhanced security.

### **Admin Capabilities**
- ✏️ Edit About, Contact, and Gallery content
- 🎨 Manage project showcases and tech stack
- 📖 Write and publish stories/blog posts
- 🤖 AI-powered text optimization using OpenAI
- 📊 View site analytics and ratings

---

## 📱 Progressive Web App

This portfolio is fully PWA-enabled:
- **Installable** on mobile and desktop devices
- **Offline Support** for cached pages
- **App-like Experience** with custom splash screens
- **Fast Loading** with service worker caching

To install, visit the site on a supported browser and look for the "Install" prompt.

---

## 🎯 Performance Optimizations

- **Next.js Image** component for automatic image optimization
- **Dynamic imports** for code splitting
- **Font optimization** with `next/font`
- **Webpack configuration** for custom builds
- **Lazy loading** for below-the-fold content
- **Memoization** and React optimization patterns

---

## 🔒 Security Features

- **Security Headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **MFA Support** for admin authentication
- **Environment Variables** for sensitive data
- **Supabase RLS** (Row Level Security) policies
- **Input Validation** and sanitization

---

## 🌐 Deployment

### **Vercel (Recommended)**
This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy!

### **Other Platforms**
Compatible with any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use this project for personal or commercial purposes
- ✅ Modify and adapt the code to your needs
- ✅ Distribute copies of the project
- ✅ Use it as a foundation for your own portfolio

**Attribution is appreciated but not required!**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AbhishekS04/portfolio/issues).

### **How to Contribute**
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💬 Contact

**Abhishek Singh** - Product Engineer

- 📧 Email: [Abhishek23main@gmail.com](mailto:Abhishek23main@gmail.com)
- 🔗 LinkedIn: [linkedin.com/in/AbhishekS04](https://linkedin.com/in/AbhishekS04)
- 🐙 GitHub: [@AbhishekS04](https://github.com/AbhishekS04)
- 🐦 Twitter: [@AbhishekS04](https://twitter.com/AbhishekS04)
- 🌐 Website: [abhishekkpf.vercel.app](https://abhishekkpf.vercel.app)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment and hosting
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling
- All open-source contributors who make amazing tools

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/AbhishekS04/portfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/AbhishekS04/portfolio?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/AbhishekS04/portfolio?style=social)

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

Made with ❤️ by [Abhishek Singh](https://github.com/AbhishekS04)

</div>
