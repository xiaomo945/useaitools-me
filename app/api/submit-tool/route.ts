import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { name, url, category, description, pricing, needs_vpn } = await request.json();
    
    if (!name || !url || !category || !description) {
      return NextResponse.json({ success: false, message: 'Please fill in all required fields' }, { status: 400 });
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

    const newTool = {
      id: Date.now(),
      name,
      url,
      category,
      description,
      pricing: pricing || 'Unknown',
      needs_vpn: needs_vpn || false,
      submittedAt: new Date().toISOString()
    };

    submittedTools.push(newTool);

    fs.writeFileSync(submittedToolsPath, JSON.stringify(submittedTools, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Tool submitted successfully! We will review it and add it to the directory.',
      tool: newTool
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- error handled by returning error response
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}