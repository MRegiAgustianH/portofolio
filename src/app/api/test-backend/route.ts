import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND_URL = 'https://portofolio-backend-production-9cb2.up.railway.app';

  try {
    const response = await fetch(`${BACKEND_URL}/projects`);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      backendUrl: BACKEND_URL,
      projectsCount: Array.isArray(data) ? data.length : 0,
      data: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Failed to connect to Railway backend'
    }, { status: 500 });
  }
}