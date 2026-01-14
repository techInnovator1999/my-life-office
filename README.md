# PipelineHub - Frontend

React + TypeScript + Vite frontend application for the CRM MVP.

## Tech Stack

- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with light/dark theme support
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io-client** - Real-time updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.development` file (copy from `.env.development.example` if available):
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_NODE_ENV=development
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── store/          # Context API state management
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles and themes
│   ├── routes/         # Route configuration
│   └── config/         # Configuration files
```

## Environment Variables

See `.env.development` and `.env.production` for required environment variables.


