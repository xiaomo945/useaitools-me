import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkRateLimit, getClientIp, isValidUrl, isValidLength } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 速率限制：每 IP 每分钟 3 次
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(ip, { max: 3 });
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, url, category, description, pricing, needs_vpn } = await request.json();

    // 必填校验
    if (!name || !url || !category || !description) {
      return NextResponse.json({ success: false, message: 'Please fill in all required fields' }, { status: 400 });
    }

    // 字段长度校验
    if (!isValidLength(name, 1, 100)) {
      return NextResponse.json({ success: false, message: 'Tool name must be 1-100 characters' }, { status: 400 });
    }
    if (!isValidLength(description, 10, 2000)) {
      return NextResponse.json({ success: false, message: 'Description must be 10-2000 characters' }, { status: 400 });
    }
    if (!isValidLength(category, 1, 50)) {
      return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });
    }

    // URL 格式校验
    if (!isValidUrl(url)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid URL (http or https)' }, { status: 400 });
    }

    const submittedToolsPath = path.join(process.cwd(), 'data', 'submitted-tools.json');

    let submittedTools: {
      id: number;
      name: string;
      url: string;
      category: string;
      description: string;
      pricing: string;
      needs_vpn: boolean;
      submittedAt: string;
    }[] = [];

    if (fs.existsSync(submittedToolsPath)) {
      const data = fs.readFileSync(submittedToolsPath, 'utf-8');
      submittedTools = JSON.parse(data);
    }

    // 重复 URL 检查
    if (submittedTools.some((t) => t.url === url)) {
      return NextResponse.json({ success: false, message: 'This tool has already been submitted' }, { status: 409 });
    }

    const newTool = {
      id: Date.now(),
      name: name.slice(0, 100),
      url,
      category: category.slice(0, 50),
      description: description.slice(0, 2000),
      pricing: pricing ? String(pricing).slice(0, 50) : 'Unknown',
      needs_vpn: Boolean(needs_vpn),
      submittedAt: new Date().toISOString()
    };

    submittedTools.push(newTool);

    fs.writeFileSync(submittedToolsPath, JSON.stringify(submittedTools, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Tool submitted successfully! We will review it and add it to the directory.',
      tool: newTool
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}