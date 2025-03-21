# My Shop Admin Panel

This is an admin panel for Yin.co built with Next.js, React, TypeScript, and Apollo Client.

## Features

- User management
- Tier management
- Authentication with NextAuth
- Google Maps integration
- Responsive UI using Tailwind CSS

## Prerequisites

- Node.js (v16 or later)
- Yarn or npm
- Backend API running on http://localhost:8080

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd my-shop-admin
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NODE_ENV=development
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your-google-map-api-key
```

### Development

Start the development server:

```bash
yarn dev-admin
```

The application will be available at http://localhost:3001

### Build

Build the application for production:

```bash
yarn build-admin
```

### Linting

Run ESLint:

```bash
yarn lint
```

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: React components
- `/src/lib`: Utility functions and custom hooks

## Dependencies

- Next.js 15.1.6
- React 19.0.0
- Apollo Client 3.12.8
- Tailwind CSS 3.4.1
- NextAuth 4.24.11
- HeadlessUI 2.2.0
- React Hook Form 7.54.2
- SweetAlert2 11.15.10
- Google Maps API integration
```
