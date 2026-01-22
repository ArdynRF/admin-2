import { NextResponse } from 'next/server';
import { getCustomerData } from '@/actions/authActions';
import { 
  createBillingAddress, 
  updateBillingAddress, 
  deleteBillingAddress 
} from '@/actions/profileAction';

// GET - Get user billing addresses
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
    const { getUserProfileClient } = await import('@/actions/profileAction');
    const profile = await getUserProfileClient(userId);
    
    return NextResponse.json({
      success: true,
      data: profile.billingAddresses || []
    });
  } catch (error) {
    console.error('GET Billing Addresses error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch billing addresses' },
      { status: 500 }
    );
  }
}

// POST - Create new billing address
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
    
    const result = await createBillingAddress(userId, body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST Billing Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create billing address' },
      { status: 500 }
    );
  }
}

// PUT - Update billing address
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const billingId = searchParams.get('id');
    
    if (!billingId) {
      return NextResponse.json(
        { error: 'Billing address ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await updateBillingAddress(billingId, body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT Billing Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update billing address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete billing address
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const billingId = searchParams.get('id');
    
    if (!billingId) {
      return NextResponse.json(
        { error: 'Billing address ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteBillingAddress(billingId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE Billing Address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete billing address' },
      { status: 500 }
    );
  }
}