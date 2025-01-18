# MatchPro Resume

A comprehensive resume optimization and job matching platform built with modern web technologies.

## Features

- Resume optimization with AI
- Job matching algorithm
- Interview coaching
- Resume tailoring
- Stripe payment integration
- Modern UI with Material-UI and Tailwind CSS
- PDF and Word document processing

## Project Structure

```
matchpro-resume/
├── apps/
│   ├── app-interview-coach/    # Interview coaching application
│   ├── app-job-matching/       # Job matching application
│   ├── app-matchpro-resume/    # Main resume optimization app
│   ├── app-resume-tailoring/   # Resume tailoring application
│   └── matchproresumewebsite/  # Marketing website
├── libs/
│   ├── config/                 # Shared configuration
│   ├── data/                   # Data utilities
│   ├── styles/                 # Shared styles
│   └── ui/                     # Shared UI components
└── [other configuration files]
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build all applications
- `npm run test` - Run tests
- `npm run lint` - Run linting

## Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

- `OPENAI_API_KEY` - For AI features
- `STRIPE_SECRET_KEY` - For payment processing
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - For database access

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
