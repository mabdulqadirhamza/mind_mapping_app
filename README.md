# 🎯 Personal 360 Growth Radar - Lovable

An interactive radial mind map for tracking and visualizing your professional skills. Built with React Flow and D3.js for a beautiful, space-themed skill visualization experience.

![Personal 360 Growth Radar](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ Features

- **Radial Skill Visualization** - Skills arranged in a 360° circular layout around your profile
- **Interactive Nodes** - Click any skill to view details and edit ratings
- **Mentor Mode Sidebar** - Edit skill names, ratings (1-10), and add mentor notes
- **Color-Coded Ratings** - Visual indicators for skill levels:
  - 🔴 Red (1-4): Beginner
  - 🟡 Yellow (5-7): Intermediate  
  - 🟢 Green (8-10): Expert
- **PNG Export** - Capture your entire skill radar as a high-resolution image
- **Persistent Storage** - All data saved to localStorage
- **Deep Space Theme** - Beautiful dark mode with glow effects

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Visualization:** React Flow (@xyflow/react)
- **Layout Algorithm:** D3-hierarchy (radial tree layout)
- **Styling:** Tailwind CSS + shadcn/ui
- **Export:** html-to-image

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd personal-360-growth-radar

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

### Deploy to Vercel

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# Deploy to production
vercel --prod
```

#### Option 3: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite - just click "Deploy"
6. Your app will be live in ~1 minute!

**Build Settings (auto-detected):**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### Deploy to Netlify

#### Option 1: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

#### Option 2: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project first
npm run build

# Deploy to a draft URL (for testing)
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Option 3: Netlify Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git provider and select repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

#### Netlify Configuration File (Optional)

Create `netlify.toml` in your project root for consistent deployments:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Then run:
npm run deploy
```

**Note:** For GitHub Pages, update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

## 📁 Project Structure

```
src/
├── components/
│   ├── radar/
│   │   ├── GrowthRadar.tsx    # Main radar component
│   │   ├── CenterNode.tsx     # Center profile node
│   │   ├── SkillNode.tsx      # Individual skill nodes
│   │   ├── MentorSidebar.tsx  # Edit panel sidebar
│   │   └── RadarHeader.tsx    # Header with export button
│   └── ui/                    # shadcn/ui components
├── context/
│   └── RadarContext.tsx       # Global state management
├── utils/
│   └── radialLayout.ts        # D3 radial layout algorithm
├── types/
│   └── skill.ts               # TypeScript interfaces
└── pages/
    └── Index.tsx              # Main page
```

## 🎨 Customization

### Modify Default Skills

Edit the seed data in `src/types/skill.ts`:

```typescript
export const SEED_DATA: RadarData = {
  rootName: "Your Name",
  skills: [
    {
      id: "skill-1",
      label: "Your Skill Category",
      rating: 7,
      children: [/* sub-skills */],
    },
    // Add more skills...
  ],
};
```

### Change Theme Colors

Update CSS variables in `src/index.css`:

```css
:root {
  --primary: 199 89% 48%;        /* Main accent color */
  --accent: 262 83% 58%;         /* Secondary accent */
  --rating-beginner: 0 72% 51%;  /* Red for 1-4 */
  --rating-intermediate: 38 92% 50%; /* Yellow for 5-7 */
  --rating-expert: 142 71% 45%;  /* Green for 8-10 */
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Lovable](https://lovable.dev)
