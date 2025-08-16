import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    )

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing environment variables',
          missing: missingEnvVars,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Basic health check response
    return NextResponse.json({
      status: 'ok',
      message: 'FlyMilhas API is running',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'configured',
        auth: 'configured',
        environment: 'ok',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}