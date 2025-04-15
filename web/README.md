# Web Terminal Frontend

A modern React-based frontend for the Web Terminal project. This application provides a browser-based interface for interacting with remote terminal sessions, managing projects, and editing code.

## 🌟 Features

- Interactive terminal interface with WebSocket connectivity
- Code editor with syntax highlighting (Monaco editor)
- File browser for managing project files
- Project creation and management
- User authentication flow
- Responsive design with mobile support
- Modern UI using shadcn/ui components
- State management with Zustand

## 🏗️ Project Structure

```
web/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── editor/       # Code editor components
│   │   ├── file-sidebar/ # File browser components
│   │   ├── projects/     # Project management components
│   │   ├── terminal/     # Terminal components
│   │   └── ui/           # UI library components (shadcn)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and state management
│   │   ├── auth-store.ts # Authentication state
│   │   ├── file-store.ts # File management state
│   │   ├── projects-store.ts # Project management state
│   │   ├── terminal-store.ts # Terminal state
│   │   ├── store.ts      # Store initialization
│   │   └── utils.ts      # Helper utilities
│   ├── pages/            # Application pages
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ and npm/pnpm
- Backend service running on http://localhost:8000

### Installation

```bash
# Install dependencies
pnpm install  # or npm install

# Start development server
pnpm dev      # or npm run dev
```

The development server will be available at http://localhost:5173 by default.

### Building for Production

```bash
# Create optimized production build
pnpm build    # or npm run build

# Preview production build locally
pnpm preview  # or npm run preview
```

## 🔌 API Connections

The frontend interacts with the backend through:

1. RESTful API endpoints for project management
2. WebSocket connections for terminal sessions
3. File upload/download for file management

All connection URLs are configured to use the backend service url, defaulting to http://localhost:8000 in development.

## 🖥️ Terminal Integration

The terminal component connects to a WebSocket endpoint based on the current user and project:

```
ws://localhost:8000/ws/{user_id}/{project_id}
```

Each terminal session corresponds to a Docker container running on the backend.

## 📝 Code Editor

The application uses Monaco Editor for code editing, supporting:

- Syntax highlighting for multiple languages
- Basic IntelliSense
- File saving and loading

## 📦 Key Dependencies

- **React**: UI framework
- **React Router**: Page routing
- **Zustand**: State management
- **Monaco Editor**: Code editor
- **shadcn/ui**: UI component library
- **TailwindCSS**: Utility-first CSS
- **Vite**: Build tool

## 🧪 Testing

Run linting checks:

```bash
pnpm lint  # or npm run lint
```

## 🔧 Configuration

The frontend can be configured through environment variables:

- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket URL for terminal connections

## 🤝 Contributing

See the main project README for contribution guidelines.

Last updated: April 15, 2025