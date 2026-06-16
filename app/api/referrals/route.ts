import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Data file paths
const dataDir = path.join(process.cwd(), 'data');
const referralsFile = path.join(dataDir, 'referrals.json');

// Ensure data files exist
function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(referralsFile)) {
    fs.writeFileSync(referralsFile, JSON.stringify([], null, 2));
  }
}

// Generate unique referral code
function generateReferralCode(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return `REF${Math.abs(hash).toString(36).toUpperCase().substring(0, 6)}`;
}

// GET: Get user's referral link and stats
export async function GET(request: NextRequest) {
  try {
    ensureDataFiles();
    
    const userId = request.headers.get('x-user-id') || 
                   `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const referrals = JSON.parse(fs.readFileSync(referralsFile, 'utf-8'));
    
    // Get user's referrals
    const userReferrals = referrals.filter((r: any) => r.referrerId === userId);
    
    // Generate referral code
    const referralCode = generateReferralCode(userId);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://useaitools.me';
    const referralLink = `${baseUrl}?ref=${referralCode}`;
    
    // Calculate stats
    const totalReferrals = userReferrals.length;
    const successfulReferrals = userReferrals.filter((r: any) => r.status === 'completed').length;
    const pendingReferrals = userReferrals.filter((r: any) => r.status === 'pending').length;
    
    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        referralLink,
        stats: {
          total: totalReferrals,
          successful: successfulReferrals,
          pending: pendingReferrals,
        },
        history: userReferrals.slice(-20).reverse(), // Last 20 records
      },
    });
  } catch (error) {
    console.error('Get referral error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get referral data' },
      { status: 500 }
    );
  }
}

// POST: Track a new referral signup
export async function POST(request: NextRequest) {
  try {
    ensureDataFiles();
    
    const body = await request.json();
    const { referralCode, newUserId } = body;
    
    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { success: false, message: 'Missing referral code or new user ID' },
        { status: 400 }
      );
    }
    
    const referrals = JSON.parse(fs.readFileSync(referralsFile, 'utf-8'));
    
    // Check if this referral code already exists for this new user
    const existingReferral = referrals.find((r: any) => 
      r.referralCode === referralCode && r.newUserId === newUserId
    );
    
    if (existingReferral) {
      return NextResponse.json({
        success: false,
        message: 'Referral already tracked',
        data: existingReferral,
      });
    }
    
    // Find referrer ID from code
    const referrerReferral = referrals.find((r: any) => r.referralCode === referralCode);
    const referrerId = referrerReferral?.referrerId || 'unknown';
    
    // Create new referral record
    const newReferral = {
      id: Date.now(),
      referralCode,
      referrerId,
      newUserId,
      status: 'pending', // Will be updated to 'completed' when new user performs action
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    
    referrals.push(newReferral);
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Referral tracked successfully',
      data: newReferral,
    });
  } catch (error) {
    console.error('Track referral error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

// PATCH: Complete a referral (award points to referrer)
export async function PATCH(request: NextRequest) {
  try {
    ensureDataFiles();
    
    const body = await request.json();
    const { referralId } = body;
    
    if (!referralId) {
      return NextResponse.json(
        { success: false, message: 'Missing referral ID' },
        { status: 400 }
      );
    }
    
    const referrals = JSON.parse(fs.readFileSync(referralsFile, 'utf-8'));
    const referralIndex = referrals.findIndex((r: any) => r.id === referralId);
    
    if (referralIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Referral not found' },
        { status: 404 }
      );
    }
    
    const referral = referrals[referralIndex];
    
    if (referral.status === 'completed') {
      return NextResponse.json({
        success: false,
        message: 'Referral already completed',
        data: referral,
      });
    }
    
    // Update referral status
    referral.status = 'completed';
    referral.completedAt = new Date().toISOString();
    referrals[referralIndex] = referral;
    
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2));
    
    // Award points to referrer (will be handled by points API)
    // This is just a marker that the referral is complete
    
    return NextResponse.json({
      success: true,
      message: 'Referral completed successfully',
      data: referral,
    });
  } catch (error) {
    console.error('Complete referral error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to complete referral' },
      { status: 500 }
    );
  }
}
