# Nostr Marketing Platform - Frontend

A modern React + TypeScript frontend for the Nostr Marketing Backend platform, built with Vite, Tailwind CSS, and Zustand.

## 🚀 Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🎨 Design System

The application uses a custom design system based on Bitcoin and Lightning Network branding:

- **Primary Color**: Bitcoin Orange (#F7931A)
- **Secondary Color**: Lightning Purple (#7B3FF2)
- **Theme**: Dark mode by default
- **Typography**: Inter font family
- **Components**: Custom styled components with Tailwind

## 📁 Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Axios instance with interceptors
│   └── endpoints.ts  # API endpoint constants
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # React components
│   ├── common/       # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components (AppLayout, etc.)
├── config/           # Configuration files
│   └── constants.ts  # App constants and environment variables
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Campaigns.tsx
│   └── Settings.tsx
├── store/            # Zustand stores
│   ├── authStore.ts  # Authentication state
│   └── uiStore.ts    # UI state (theme, sidebar, toasts)
├── styles/           # Global styles
│   └── index.css     # Tailwind directives and custom styles
├── types/            # TypeScript type definitions
│   ├── api.ts        # API response types
│   ├── common.ts     # Common UI types
│   └── index.ts      # Type exports
├── utils/            # Utility functions
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm 8+

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   VITE_API_BASE_URL=http://localhost:8006
   VITE_ADMIN_API_BASE_URL=http://localhost:8010
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```
   
   The app will be available at `http://localhost:5173`

## 📜 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean build artifacts and cache

## 🔧 Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { api } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
```

### Tailwind Configuration

Custom Tailwind configuration is in `tailwind.config.js` with:
- Bitcoin Orange and Lightning Purple color schemes
- Dark mode support
- Custom spacing, shadows, and animations
- Form plugin for better form styling

### API Client

The Axios client (`src/api/client.ts`) includes:
- Automatic authentication token injection
- Request/response interceptors
- Error handling and logging
- Type-safe API helpers

## 🎯 Key Features

### State Management

- **Auth Store**: User authentication, login/logout, token management
- **UI Store**: Theme, sidebar state, toasts, modals

### Routing

- Dashboard (`/`)
- Campaigns (`/campaigns`)
- Settings (`/settings`)

### API Integration

- Centralized API client with interceptors
- Type-safe endpoint constants
- Automatic error handling
- Token-based authentication

## 🎨 Styling Guidelines

### Using Tailwind Classes

```tsx
// Button styles
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-ghost">Ghost Button</button>

// Card styles
<div className="card">Card content</div>
<div className="card card-hover">Hoverable card</div>

// Input styles
<input className="input" />
<input className="input input-error" />

// Badge styles
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
```

### Custom CSS Variables

Available CSS variables in `src/styles/index.css`:
- `--bitcoin-orange`, `--lightning-purple`
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-primary`, `--border-secondary`

## 🔐 Authentication

The app uses JWT token-based authentication:

1. Login credentials are sent to `/auth/login`
2. Token is stored in localStorage
3. Token is automatically included in API requests
4. On 401 errors, user is redirected to login

## 📊 Type Safety

All API responses and data structures are fully typed:

```typescript
import type { Campaign, CampaignCreate, User } from '@/types';
```

## 🚧 Development Guidelines

1. **Component Structure**: Keep components small and focused
2. **Type Safety**: Always define TypeScript types
3. **State Management**: Use Zustand stores for global state
4. **Styling**: Use Tailwind utility classes, avoid inline styles
5. **API Calls**: Use the centralized API client
6. **Error Handling**: Handle errors gracefully with toasts

## 🔄 Next Steps

This is the foundation setup. Next phases include:

1. **Phase 2**: Implement campaign management components
2. **Phase 3**: Add monitoring and analytics dashboards
3. **Phase 4**: Build review queue interface
4. **Phase 5**: Add admin features
5. **Phase 6**: Polish and optimize

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Main API base URL | `http://localhost:8006` |
| `VITE_ADMIN_API_BASE_URL` | Admin API base URL | `http://localhost:8010` |
| `VITE_POLLING_INTERVAL_MONITORING` | Monitoring poll interval (ms) | `5000` |
| `VITE_POLLING_INTERVAL_DASHBOARD` | Dashboard poll interval (ms) | `30000` |
| `VITE_POLLING_INTERVAL_REVIEW` | Review queue poll interval (ms) | `10000` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper type definitions
4. Test your changes locally
5. Follow the design system guidelines

## 📄 License

This project is part of the Nostr Marketing Platform.

---

Built with ⚡ by the Nostr Marketing team
