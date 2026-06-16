import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Points configuration
export const POINTS_CONFIG = {
  share_tool: 10,
  share_blog: 20,
  referral_signup: 100,
};

// Data file paths
const dataDir = path.join(process.cwd(), 'data');
const pointsFile = path.join(dataDir, 'points.json');
const referralsFile = path.join(dataDir, 'referrals.json');

// Ensure data files exist
function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(referralsFile)) {
    fs.writeFileSync(referralsFile, JSON.stringify([], null, 2));
  }
}

// Get user ID from request (anonymous or authenticated)
function getUserId(request: NextRequest): string {
  // Try to get from header (for anonymous tracking)
  const userId = request.headers.get('x-user-id');
  if (userId) return userId;
  
  // Generate anonymous ID if not provided
  return `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// GET: Get user points
export async function GET(request: NextRequest) {
  try {
    ensureDataFiles();
    
    const userId = getUserId(request);
    const points = JSON.parse(fs.readFileSync(pointsFile, 'utf-8'));
    
    // Calculate user's total points
    const userPoints = points.filter((p: any) => p.userId === userId);
    const totalPoints = userPoints.reduce((sum: number, p: any) => sum + p.points, 0);
    
    // Count actions
    const shareCount = userPoints.filter((p: any) => p.action.startsWith('share_')).length;
    const referralCount = userPoints.filter((p: any) => p.action === 'referral_signup').length;
    
    return NextResponse.json({
      success: true,
      data: {
        userId,
        totalPoints,
        shareCount,
        referralCount,
        lastUpdated: userPoints.length > 0 
          ? userPoints[userPoints.length - 1].createdAt 
          : new Date().toISOString(),
        history: userPoints.slice(-20).reverse(), // Last 20 records
      },
    });
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get points' },
      { status: 500 }
    );
  }
}

// POST: Award points for an action
export async function POST(request: NextRequest) {
  try {
    ensureDataFiles();
    
    const body = await request.json();
    const { action, targetType, targetId } = body;
    
    // Validate action
    if (!action || !POINTS_CONFIG[action as keyof typeof POINTS_CONFIG]) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
    
    const userId = getUserId(request);
    const points = POINTS_CONFIG[action as keyof typeof POINTS_CONFIG];
    
    // Read existing points
    const allPoints = JSON.parse(fs.readFileSync(pointsFile, 'utf-8'));
    
    // Check for duplicate (prevent spam - same action within 1 hour)
    const recentAction = allPoints.find((p: any) => 
      p.userId === userId && 
      p.action === action && 
      p.targetId === targetId &&
      new Date(p.createdAt) > new Date(Date.now() - 3600000) // 1 hour
    );
    
    if (recentAction) {
      return NextResponse.json({
        success: false,
        message: 'Points already awarded for this action recently',
        data: {
          points: 0,
          cooldownUntil: new Date(new Date(recentAction.createdAt).getTime() + 3600000).toISOString(),
        },
      });
    }
    
    // Create new points record
    const newRecord = {
      id: Date.now(),
      userId,
      action,
      points,
      createdAt: new Date().toISOString(),
      targetType,
      targetId,
    };
    
    allPoints.push(newRecord);
    fs.writeFileSync(pointsFile, JSON.stringify(allPoints, null, 2));
    
    // Calculate new total
    const userPoints = allPoints.filter((p: any) => p.userId === userId);
    const totalPoints = userPoints.reduce((sum: number, p: any) => sum + p.points, 0);
    
    return NextResponse.json({
      success: true,
      message: `Awarded ${points} points for ${action}`,
      data: {
        points,
        totalPoints,
        record: newRecord,
      },
    });
  } catch (error) {
    console.error('Award points error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to award points' },
      { status: 500 }
    );
  }
}
