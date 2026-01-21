import { NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/actions/profileAction';

export async function GET(request) {
  try {
    console.log('Profile API GET called');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('User ID from params:', userId);
    
    if (!userId) {
      console.error('User ID is missing');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Fetching profile for user ID:', userId);
    const userProfile = await getUserProfile(userId);
    
    console.log('Profile data retrieved:', userProfile);
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error in profile GET API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('Profile API PUT called');
    
    const body = await request.json();
    const { userId, ...data } = body;
    
    console.log('User ID:', userId);
    console.log('Update data:', data);
    
    if (!userId) {
      console.error('User ID is missing in PUT request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Create FormData object from the data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('shippingAddresses', JSON.stringify(data.shippingAddresses || []));
    formData.append('billingAddresses', JSON.stringify(data.billingAddresses || []));
    
    console.log('Calling server action updateUserProfileServer...');
    await updateUserProfile(formData, userId);
    
    console.log('Profile updated successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error in profile PUT API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update profile', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}