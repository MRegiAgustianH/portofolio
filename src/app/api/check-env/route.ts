import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    api_url: process.env.NEXT_PUBLIC_API_URL,
    runtime: process.env.NODE_ENV,
    message: 'API URL configuration check'
  });
}