import { NextResponse } from 'next/server';
import { getCustomerData } from '@/actions/authActions';
import { 
  getUserProfileClient, 
  updateUserProfileClient,
  updatePasswordClient,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  createBillingAddress,
  updateBillingAddress,
  deleteBillingAddress
} from '@/actions/profileAction';

// GET - Get user profile
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Request URL:", request.url);
    console.log("Search Params:", searchParams);
    const userId = searchParams.get('userId');

    if (!userId) {
      // If no userId provided, get from session
      const customer = await getCustomerData();
      if (!customer || !customer.data) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      userId = customer.data.id;
    }
    console.log("debug userId:", userId);

    const profile = await getUserProfileClient(Number(userId));
    console.log("Fetched profile:", profile);
    return NextResponse.json({
      message: 'Profile fetched successfully',
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('GET Profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    const customer = await getCustomerData();
    if (!customer || !customer.data) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = customer.data.id;
    const body = await request.json();
    
    const result = await updateUserProfileClient(userId, body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT Profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update password
export async function PATCH(request) {
  try {
    const customer = await getCustomerData();
    if (!customer || !customer.data) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = customer.data.id;
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    const result = await updatePasswordClient(userId, currentPassword, newPassword);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('PATCH Password error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}