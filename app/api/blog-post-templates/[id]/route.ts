import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.blogPostTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...template,
      structure: JSON.parse(template.structure),
      guidelines: template.guidelines ? JSON.parse(template.guidelines) : null,
    });
  } catch (error) {
    console.error('Failed to fetch blog post template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, description, structure, guidelines, isActive, isDefault } = body;

    if (!name || !type || !structure) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await prisma.blogPostTemplate.updateMany({
        where: { type, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const template = await prisma.blogPostTemplate.update({
      where: { id },
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
    console.error('Failed to update blog post template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if template is in use
    const postsUsingTemplate = await prisma.blogPost.count({
      where: { templateId: id },
    });

    if (postsUsingTemplate > 0) {
      return NextResponse.json(
        { error: `Cannot delete template: ${postsUsingTemplate} posts are using it` },
        { status: 400 }
      );
    }

    await prisma.blogPostTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog post template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
