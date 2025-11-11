# GovAIx Next.js Application

A modern React/Next.js application showcasing AI-powered government services with multi-agent systems.

## Features

- **The 4-Hour Demo Build**: Timeline showcasing rapid development of AI government services
- **Demo Scenarios**: Three comprehensive demo scenarios for different government services
- **Live Demos**: Interactive demo routes for business licenses, permits, and voice services
- **Analytics Dashboard**: Real-time metrics and agent performance analytics
- **Multi-language Support**: Japanese and English translation capabilities
- **Voice Integration**: Speech-to-text and text-to-speech functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Demo Routes

- `/demo/license` - Business license application with auto-verification
- `/demo/permit` - Multi-language permit processing
- `/demo/voice` - Voice-based service inquiry in Japanese
- `/dashboard` - Analytics dashboard with performance metrics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Build Tool**: Vite
- **Package Manager**: npm/pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd govaix-next
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_DEDALUS_API_URL=https://api.dedalus.example.com
NEXT_PUBLIC_RANDOM_LABS_API_KEY=your-api-key
NEXT_PUBLIC_CRUSTDATA_API_KEY=your-api-key
NEXT_PUBLIC_LINGO_API_KEY=your-api-key
NEXT_PUBLIC_SHISA_API_KEY=your-api-key
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_DEDALUS_API_URL` | Dedalus Labs API endpoint | `https://api.dedalus.mock` |
| `NEXT_PUBLIC_RANDOM_LABS_API_KEY` | Random Labs API key | `mock-key` |
| `NEXT_PUBLIC_CRUSTDATA_API_KEY` | CrustData API key | `mock-key` |
| `NEXT_PUBLIC_LINGO_API_KEY` | Lingo translation API key | `mock-key` |
| `NEXT_PUBLIC_SHISA_API_KEY` | Shisa AI API key | `mock-key` |

## Service Integrations

The application includes service stubs for:

- **Dedalus Labs**: Agent routing and MCP server management
- **Random Labs**: Compliance code generation
- **CrustData**: Business verification and data enrichment
- **Lingo**: Real-time translation services
- **Shisa AI**: Speech-to-text and text-to-speech

All services include mock implementations that work without real API keys.

## Development

### Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── demo/              # Demo route pages
│   ├── dashboard/         # Analytics dashboard
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── DemoBuild.tsx      # 4-Hour Demo Build section
│   ├── DemoScenarios.tsx  # Demo Scenarios section
│   └── Navigation.tsx     # Navigation component
├── lib/                   # Utility libraries
│   ├── config/            # Configuration files
│   ├── services/          # Service integrations
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

Build the application:
```bash
npm run build
```

The output will be in `.next/` directory.

## Accessibility

The application includes:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Semantic HTML structure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
