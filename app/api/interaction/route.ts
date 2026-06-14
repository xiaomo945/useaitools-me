import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SID_COOKIE = 'sid';
const SID_MAX_AGE = 60 * 60 * 24 * 30;

function generateSid(): string {
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    return (crypto as any).randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function getOrCreateSid(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get(SID_COOKIE)?.value;
    if (existing && existing.trim().length > 0) {
      return existing;
    }
    const newSid = generateSid();
    cookieStore.set(SID_COOKIE, newSid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SID_MAX_AGE,
    });
    return newSid;
  } catch (e) {
    return generateSid();
  }
}

export async function POST(request: NextRequest) {
  let sessionId = '';
  try {
    sessionId = await getOrCreateSid();

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const {
      actionType,
      toolId,
      toolName,
      category,
      searchQuery,
      metadata,
    } = body;

    if (!actionType || typeof actionType !== 'string' || actionType.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid actionType', sessionId },
        { status: 400 }
      );
    }

    let metadataStr: string | null = null;
    if (metadata !== undefined && metadata !== null) {
      if (typeof metadata === 'string') {
        metadataStr = metadata;
      } else {
        try {
          metadataStr = JSON.stringify(metadata);
        } catch {
          metadataStr = null;
        }
      }
    }

    await prisma.userInteraction.create({
      data: {
        sessionId,
        actionType: actionType.trim().slice(0, 50),
        toolId: toolId ? String(toolId).slice(0, 100) : null,
        toolName: toolName ? String(toolName).slice(0, 200) : null,
        category: category ? String(category).slice(0, 100) : null,
        searchQuery: searchQuery ? String(searchQuery).slice(0, 500) : null,
        metadata: metadataStr ? metadataStr.slice(0, 2000) : null,
      },
    });

    return NextResponse.json({ success: true, sessionId });
  } catch (e) {
    console.error('api/interaction POST error:', e);
    return NextResponse.json(
      { success: false, error: 'Failed to record interaction', sessionId: sessionId || '' },
      { status: 500 }
    );
  }
}
