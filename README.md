<div align="center">

# Hi 👋, I'm Abhishek Singh

### Product Engineer | Creative Developer | React, Next.js, TypeScript Specialist | Building Premium Web Experiences

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black.svg)
![React](https://img.shields.io/badge/React-19.2.5-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

**A modern, progressive web application portfolio with stunning animations and interactive experiences**

Live Demo: [abhisheksingh.tech](https://abhisheksingh.tech)

</div>

<!-- --- -->

## 📸 Preview

<div align="center">

[![Portfolio Preview](https://cloud-snapp.vercel.app/api/cdn/portfoliocloudsnapimage.png?fmt=webp)](https://www.abhisheksingh.tech)
_Click the image to visit the live site_

</div>

---

## ⚠️ Important Notice

**This repository is for SHOWCASE and REFERENCE purposes only.**

This is a **proprietary portfolio** - the code and design are the exclusive property of Abhishek Singh and are protected under copyright law.

### 🚫 What You CANNOT Do:

- ❌ Copy, clone, or fork this repository for your own use
- ❌ Use this code in your own projects
- ❌ Modify or create derivative works
- ❌ Distribute, share, or republish the code
- ❌ Use for commercial purposes
- ❌ Remove or modify copyright notices

### ✅ What You CAN Do:

- ✅ View the live website
- ✅ Browse the code for learning and inspiration
- ✅ Reference the techniques and approaches used

### 📧 Need Permission?

If you're interested in using any part of this portfolio, you must contact me directly:

- **Email:** [Abhishek23main@gmail.com](mailto:Abhishek23main@gmail.com)
- **Subject:** "Portfolio License Permission Request"

---

## 🎯 About This Portfolio

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
- **Command Palette** - Quick navigation via keyboard shortcuts (⌘K)
- **Consciousness Mode** - A hidden, "witnessed" UI state triggered by holding **Shift + Slow Scroll** for 7 seconds.
- **Social Stories** - Instagram-style highlights fetched dynamically via the **Dedigram API**.
- **Admin Dashboard** - Full CMS for content management
- **MFA Security** - Two-factor authentication for admin access

### 🎁 **Easter Eggs**

This portfolio contains several hidden interactive features and surprises. Pay attention to details, explore thoroughly, and you might discover something special. _Hint: Sometimes the journey matters as much as the destination._

---

## 🛠️ Tech Stack

### **Core Technologies**

- [Next.js 16.2](https://nextjs.org/) - React framework with App Router
- [React 19.2](https://react.dev/) - UI library
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety

### **Styling & Animation**

- [Tailwind CSS 4.1](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion 12.2](https://www.framer.com/motion/) - Production-ready animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon set
- [21st.dev](https://21st.dev/) - Premium UI components and design inspiration

### **Backend & Infrastructure**

- [Supabase](https://supabase.com/) - Backend as a Service (Authentication & Database)
- [OpenAI API](https://openai.com/) - AI-powered text optimization
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) - Progressive Web App support
- [Lenis](https://lenis.studiofreight.com/) - Smooth scroll library

---

## 📂 Project Architecture

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/             # Main site group (Page transitions & Layout)
│   │   │   ├── page.tsx        # Homepage with Bento Gallery
│   │   │   ├── about/          # Experience & Education
│   │   │   ├── works/          # Project portfolio showcase
│   │   │   ├── gaming/         # Cyberpunk Gaming profile
│   │   │   ├── github/         # GitHub Intelligence & Stats
│   │   │   └── minimal/        # Minimalist view toggle
│   │   ├── admin/              # Full-featured CMS Dashboard
│   │   │   ├── login/          # Authentication
│   │   │   ├── mfa-setup/      # 2FA Security configuration
│   │   │   ├── projects/       # Project management
│   │   │   └── [modules]/      # Settings, Stories, Tech, etc.
│   │   ├── actions/            # Server Actions (Gallery, AI Optimization)
│   │   └── api/                # API Endpoints (Ratings, Webhooks)
│   │
│   ├── components/
│   │   ├── home/               # Featured, Bento, Identity cards
│   │   ├── works/              # Project grid, Changelog overlays
│   │   ├── ui/                 # Atomic design (Shadcn + Custom interactions)
│   │   ├── admin/              # Dashboard-specific widgets
│   │   └── github/             # Live API integrations
│   │
│   ├── app/
│   │   └── api/
│   │       └── telegram/       # Telegram Bot API integration
│   │           ├── webhook/    # Real-time story publishing logic
│   │           └── media/      # Telegram file proxy system
│   │
│   ├── lib/                    # Shared logic, fonts & static data
│   ├── utils/                  # Supabase clients & GitHub helpers
│   ├── fonts/                  # Custom typography assets
│   └── types/                  # TypeScript interfaces & declarations
│
├── public/                     # Static assets (images, icons, manifest)
├── scripts/                    # Build scripts & maintenance utilities
├── Dockerfile                  # Multi-stage production container build
└── docker-compose.yml          # Local/Production service orchestration
```

---

## 🎨 Design Philosophy

This portfolio embodies:

- **Minimalism** - Clean, focused design without unnecessary elements
- **Performance** - Optimized for speed and smooth interactions
- **Attention to Detail** - Subtle animations and micro-interactions
- **Accessibility** - WCAG compliant with keyboard navigation
- **Progressive Enhancement** - Works everywhere, enhanced on modern browsers

---

## 🚀 Key Highlights

### **Progressive Web App**

- Installable on mobile and desktop
- Offline support for cached pages
- App-like experience with custom splash screens
- Service worker caching for instant loads

### **Social Stories & Intelligence**

- **Telegram Bot API Integration** - Automated syncing of social media stories directly to the portfolio via a dedicated bot.
- **Real-time Telegram CMS** - Upload, manage, and delete stories via Telegram DM with instant Supabase injection.
- **Supabase Data Layer** - Real-time metadata management for story sequences and link attribution.
- **Hidden Interactions** - Advanced event listeners for intenational discovery (Shift+Scroll logic).

### **Deployment & Orchestration**

- **Docker-Native** - Multi-stage **Node 22-Alpine** builds optimized for minimal image size.
- **Next.js Standalone** - Decoupled runtime strategy for enterprise-grade production reliability.
- **Docker Compose** - Unified service orchestration for seamless environment parity.

### **Admin Dashboard**

- **Supabase Auth & MFA** - Multi-factor authentication with TOTP for all admin nodes.
- **AI-Powered CMS** - Integrated OpenAI optimization for portfolio text and project descriptions.
- **Real-time Management** - Dynamic content editing with instant Supabase synchronization.

### **Performance Optimizations**

- Next.js Image component for automatic optimization
- Dynamic imports for code splitting
- Font optimization with `next/font`
- Lazy loading for below-the-fold content
- Edge-ready deployment architecture

### **Security Features** 🔐

**Top-notch, enterprise-grade security implementation:**

- **Two-Factor Authentication (2FA)** - Multi-factor authentication with TOTP for admin access
- **Supabase Authentication** - Industry-standard OAuth and email verification
- **Row Level Security (RLS)** - Database-level access control policies
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy
- **Permission Policies** - Strict camera, microphone, and geolocation restrictions
- **Environment Variables** - Sensitive data protected and never exposed to client
- **Input Validation** - Comprehensive sanitization and validation
- **Session Management** - Secure token-based authentication with automatic expiry
- **HTTPS Only** - Forced secure connections in production
- **Protected Routes** - Server-side authentication checks for admin areas

---

## 📱 Responsive Design

Fully responsive across all devices:

- 📱 **Mobile** - Optimized touch interactions
- 💻 **Desktop** - Enhanced with hover effects and keyboard shortcuts
- 🖥️ **Large Screens** - Maximized content layout
- ⌚ **Small Devices** - Graceful degradation

---

## 🌐 Live Website

**Visit the live portfolio:** [abhisheksingh.tech](https://abhisheksingh.tech)

Experience the full interactive features, smooth animations, and discover the hidden easter eggs!

---

## 📄 License

**Copyright © 2026 Abhishek Singh. All Rights Reserved.**

This project is licensed under a **Proprietary License**. See the [LICENSE](LICENSE) file for complete terms.

### Summary:

- This code is **NOT open source**
- Viewing for reference/learning is permitted
- **Copying, using, or distributing is prohibited** without written permission
- Commercial use is strictly forbidden

**To request permission:** Email [Abhishek23main@gmail.com](mailto:Abhishek23main@gmail.com) with subject "Portfolio License Permission Request"

---

## 💼 Hire Me / Collaboration

Interested in working together? Let's connect!

**Abhishek Singh** - Product Engineer

- 📧 Email: [Abhishek23main@gmail.com](mailto:Abhishek23main@gmail.com)
- 🔗 LinkedIn: [linkedin.com/in/abhishek-singh200423](https://www.linkedin.com/in/abhishek-singh200423/)
- 🐙 GitHub: [AbhishekS04](https://github.com/AbhishekS04)
- 🐦 X (Twitter): [@\_abhishek2304](https://x.com/_abhishek2304)
- 🌐 Portfolio: [abhisheksingh.tech](https://abhisheksingh.tech)
- 📍 Location: Kolkata, India

### What I Offer:

- 🎨 Modern web development (React, Next.js, TypeScript)
- ⚡ Performance optimization & SEO
- 🎭 Interactive animations & UI/UX design
- 🔐 Full-stack development with authentication
- 📱 Progressive Web Apps
- 🤝 Freelance & consulting services

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and the teams behind:

- [Next.js](https://nextjs.org/) & [Vercel](https://vercel.com/) - The React framework and deployment platform
- [React](https://react.dev/) Team - For the incredible UI library
- [Framer Motion](https://www.framer.com/motion/) - Best-in-class animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Supabase](https://supabase.com/) - Backend infrastructure and authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling magic
- [21st.dev](https://21st.dev/) - 🌟 **Special shoutout for premium UI components and design inspiration**
- [Dedigram API](https://cloud-snapp.vercel.app/) - Powering the automated social stories delivery system

---

## 📊 Project Information

- **Version:** 0.1.0
- **Last Updated:** January 2026
- **Status:** Active & Maintained
- **Framework:** Next.js 16.1.1
- **Deployment:** Vercel

---

<div align="center">

### 🌟 Enjoyed exploring the portfolio?

**Visit the live site:** [abhisheksingh.tech](https://abhisheksingh.tech)

---

**This repository is for showcase purposes only. All rights reserved.**

Made with ❤️ by [Abhishek Singh](https://github.com/AbhishekS04)

© 2026 Abhishek Singh. Do not copy or distribute without permission..

</div>
