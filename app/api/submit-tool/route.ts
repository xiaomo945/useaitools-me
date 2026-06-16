import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { ToolSubmission, SubmissionTier, SubmissionStatus } from '@/types';

export async function POST(request: Request) {
  try {
    const { name, url, category, description, pricing, needs_vpn, tier, contactEmail } = await request.json();
    
    if (!name || !url || !category || !description) {
      return NextResponse.json({ success: false, message: 'Please fill in all required fields' }, { status: 400 });
    }

    // Validate paid tier requirements
    if ((tier === 'expedited' || tier === 'sponsored') && !contactEmail) {
      return NextResponse.json({ success: false, message: 'Contact email is required for paid submissions' }, { status: 400 });
    }

    const submittedToolsPath = path.join(process.cwd(), 'data', 'submitted-tools.json');
    
    let submittedTools: ToolSubmission[] = [];
    
    if (fs.existsSync(submittedToolsPath)) {
      const data = fs.readFileSync(submittedToolsPath, 'utf-8');
      submittedTools = JSON.parse(data);
    }

    const newTool: ToolSubmission = {
      id: Date.now(),
      name,
      url,
      category,
      description,
      pricing: pricing || 'Unknown',
      needs_vpn: needs_vpn || false,
      submittedAt: new Date().toISOString(),
      tier: tier || 'free',
      status: tier === 'sponsored' ? 'sponsored_active' : 'pending',
      contactEmail: contactEmail || undefined,
    };

    // For sponsored tier, set expiration date (1 month from now)
    if (tier === 'sponsored') {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      newTool.sponsoredUntil = expirationDate.toISOString();
    }

    submittedTools.push(newTool);

    fs.writeFileSync(submittedToolsPath, JSON.stringify(submittedTools, null, 2));

    // For paid tiers, we would normally redirect to payment
    // For now, we'll just mark as pending and handle payment separately
    const message = tier === 'free' 
      ? 'Tool submitted successfully! We will review it within 7-14 days.'
      : tier === 'expedited'
      ? 'Expedited submission received! Please complete payment to proceed with 24-hour review.'
      : 'Sponsored submission received! Please complete payment to activate your featured listing.';

    return NextResponse.json({ 
      success: true, 
      message,
      tool: newTool,
      paymentRequired: tier !== 'free',
      paymentAmount: tier === 'expedited' ? 29 : tier === 'sponsored' ? 99 : 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}