# Edutu - Your AI Opportunity Coach

## Project Overview
Edutu is an AI-powered opportunity coaching application built with React and TypeScript. The application helps users discover educational and career opportunities, create personalized roadmaps, and track their goals. It features a comprehensive dashboard with chat interface, goal management, and profile settings.

## Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Fonts**: Inter and Outfit (Google Fonts)
- **State Management**: React Hooks

## Project Structure
```
edutu app/
├── public/
├── src/
│   ├── components/          # React components
│   ├── design-system/       # Design tokens and UI elements
│   ├── firebase/            # Firebase integration
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx              # Main application router
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and design tokens
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Key Features
- **Multi-screen Navigation**: Landing page, authentication, dashboard, profiles, chat interface
- **Opportunity Management**: Discover, view details, and add opportunities to personal goals
- **Personalized Roadmaps**: Create and follow custom learning/development paths
- **Goal Tracking**: Manage and monitor personal objectives
- **Profile Management**: User profiles with settings, CV management, and privacy controls
- **Dark/Light Mode**: Theme support with custom design tokens
- **Community Marketplace**: Share and discover community-created roadmaps
- **Chat Interface**: AI-powered coaching conversations

## Screen Types
The application supports multiple screens:
- Landing, Authentication, Dashboard, Profile, Chat
- Opportunity Detail, All Opportunities, Roadmaps
- Settings, Notifications, Privacy, Help
- CV Management, Add Goal, Community Marketplace

## Design System
The application features a comprehensive design system with:
- Custom color tokens (brand, accent, neutral palettes)
- Surface tokens for backgrounds and layers
- Typography tokens for consistent fonts
- Elevation tokens for shadows
- Border tokens for consistent borders
- Motion tokens for transitions

## Development Setup
To run the project locally:
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Environment
- Node.js with ES modules
- Vite for fast development and building
- ESLint for code linting
- TypeScript for type safety

## Key Dependencies
- React and ReactDOM (18.3.1)
- Lucide React for icons
- Tailwind CSS for styling
- TypeScript for type checking

## Architecture Notes
- The main application logic resides in `App.tsx` which manages screen navigation and state
- Uses a router pattern with state to manage different screens
- Components are organized in the components directory
- Theme management is handled via CSS custom properties and dark mode hook
- Firebase integration suggests backend services are used for data persistence