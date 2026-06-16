# Next.js Interactive Learning Environment

A comprehensive, full-stack sandbox environment designed to facilitate the interactive study of Next.js 15, React Server Components (RSC), App Router hierarchies, Server Actions, and modern rendering strategies.

## Architecture

This application employs a modular full-stack design utilizing Vite and Express:
- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Framer Motion.
- **Backend**: Express.js proxy server with TypeScript (`tsx`).
- **Core Engine**: Implements dynamic knowledge checks and an integrated engineering assistant.

## Core Features

- **Curriculum Roadmap**: A structured sequence of modules from foundational routing to advanced caching, complete with interactive checkpoints.
- **App Directory Explorer**: Visual representation of the Next.js App Router structure alongside code definitions and a simulated browser viewport.
- **RSC Boundary Lab**: Debugging emulator for Server vs. Client boundaries.
- **Server Actions Pipeline**: Traceable workflows for progressive enhancement and form submissions.
- **Caching Pipelines**: Visual comparison of SSG, ISR, SSR, and Partial Prerendering (PPR).
- **Interactive Assistant**: Integrated system for dynamic code evaluation and conceptual guidance.

## Local Development

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm, pnpm, or Yarn

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   The application requires a Google Gemini API key to power the interactive assistant and dynamic knowledge checks.
   ```bash
   cp .env.example .env
   ```
   Add your API key to the `.env` file:
   ```env
   GEMINI_API_KEY="YOUR_API_KEY"
   APP_URL="http://localhost:3000"
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

### Production Build

To compile optimized assets and test the standalone server:
```bash
npm run build
npm run start
```

## Contributing

Review the architecture in `src/components` and expand the interactive directory explorer by customizing data in `src/data.ts`.

## License

MIT License
