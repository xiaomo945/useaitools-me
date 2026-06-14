import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.blogPostTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      templates: templates.map((t: any) => ({
        ...t,
        structure: JSON.parse(t.structure),
        guidelines: t.guidelines ? JSON.parse(t.guidelines) : null,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch blog post templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, structure, guidelines, isActive, isDefault } = body;

    if (!name || !type || !structure) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await prisma.blogPostTemplate.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.blogPostTemplate.create({
      data: {
        name,
        type,
        description,
        structure: JSON.stringify(structure),
        guidelines: guidelines ? JSON.stringify(guidelines) : null,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({
      ...template,
      structure: JSON.parse(template.structure),
      guidelines: template.guidelines ? JSON.parse(template.guidelines) : null,
    });
  } catch (error) {
    console.error('Failed to create blog post template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
