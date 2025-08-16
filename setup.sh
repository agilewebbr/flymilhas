#!/bin/bash

# FlyMilhas Setup Script
# This script sets up the FlyMilhas development environment

set -e  # Exit on any error

echo "🛫 Setting up FlyMilhas..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANT: Please update .env.local with your Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📱 Supabase CLI not found. Installing globally..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is installed"
fi

# Verify TypeScript configuration
echo "🔍 Checking TypeScript configuration..."
npx tsc --noEmit

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Set up your Supabase project:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the migrations: supabase db push"
echo "   - Seed the database: supabase db reset --seed"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Run tests:"
echo "   npm test                  # Unit tests"
echo "   npm run test:e2e:open     # E2E tests (interactive)"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""

# Optional: Check if .env.local has been configured
if grep -q "your-project-id.supabase.co" .env.local 2>/dev/null; then
    echo "⚠️  REMINDER: Update your Supabase credentials in .env.local"
fi

echo "✨ Happy coding with FlyMilhas!"