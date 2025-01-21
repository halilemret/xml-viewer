import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parametresi gerekli' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/xml,text/xml,*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Uzak sunucudan veri alınamadı' },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({ data });

  } catch (error) {
    console.error('Proxy hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
} 