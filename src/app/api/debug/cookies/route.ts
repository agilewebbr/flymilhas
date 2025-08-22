// src/app/api/debug/cookies/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || ''
  const allHeaders = Object.fromEntries(request.headers.entries())
  
  return NextResponse.json({
    cookieHeader,
    allHeaders,
    parsedCookies: cookieHeader.split(';').map(c => c.trim())
  })
}