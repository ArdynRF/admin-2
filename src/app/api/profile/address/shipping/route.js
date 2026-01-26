import { NextResponse } from 'next/server';
import { getCustomerData } from '@/actions/authActions';
import { 
  createShippingAddress, 
  updateShippingAddress, 
  deleteShippingAddress 
} from '@/actions/profileAction';

// GET - Get user shipping addresses
export async function GET(request) {
  try {
    const customer = await getCustomerData();
    if (!customer || !customer.data) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = customer.data.id;
    
    // You can use getUserProfileClient or create a specific function
    const { getUserProfileClient } = await import('@/actions/profileAction');
    const profile = await getUserProfileClient(userId);
    
    return NextResponse.json({
      success: true,
      data: profile.shippingAddresses || []
    });
  } catch (error) {
    console.error('GET Shipping Addresses error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping addresses' },
      { status: 500 }
    );
  }
}

// POST - Create new shipping address
export async function POST(request) {
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
    
    const result = await createShippingAddress(userId, body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST Shipping Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create shipping address' },
      { status: 500 }
    );
  }
}

// PUT - Update shipping address
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    
    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await updateShippingAddress(addressId, body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT Shipping Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update shipping address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete shipping address
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    
    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteShippingAddress(addressId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE Shipping Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete shipping address' },
      { status: 500 }
    );
  }
}