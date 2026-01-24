import { NextResponse } from "next/server";
import { getCustomerData } from "@/actions/authActions";

import {
  getUserProfileClient,
  updateUserProfileClient,
  updatePasswordClient,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  createBillingAddress,
  updateBillingAddress,
  deleteBillingAddress,
} from "@/actions/profileAction";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Request URL:", request.url);
    console.log("Search Params:", searchParams);
    const userId = searchParams.get("userId");

    if (!userId) {
      // If no userId provided, get from session
      const customer = await getCustomerData();
      if (!customer || !customer.data) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = customer.data.id;
    }
    console.log("debug userId:", userId);

    const profile = await getUserProfileClient(Number(userId));
    console.log("Fetched profile:", profile);
    return NextResponse.json({
      message: "Profile fetched successfully",
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("GET Profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    console.log("Received profile update data:", body);

    // 2. Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // 3. Update user profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      // a. Update basic user information
      const updatedUser = await tx.user.update({
        where: { id: body.userId },
        data: {
          name: body.name,
          phone: body.phone || null,
          email: body.email,
        },
      });

      // b. Process shipping addresses
      if (body.shippingAddresses && Array.isArray(body.shippingAddresses)) {
        // Reset all defaults if needed
        const hasNewDefault = body.shippingAddresses.some(
          (addr) => addr.is_default
        );
        const hasNewShippingDefault = body.newShippingAddresses?.some(
          (addr) => addr.is_default
        );

        if (hasNewDefault || hasNewShippingDefault) {
          await tx.shippingAddress.updateMany({
            where: { userId: body.userId, is_default: true },
            data: { is_default: false },
          });
        }

        // Update existing shipping addresses
        for (const address of body.shippingAddresses) {
          if (address.id && !address.to_delete) {
            await tx.shippingAddress.update({
              where: { id: address.id, userId: body.userId },
              data: {
                label: address.label,
                address_line: address.address_line,
                city: address.city,
                postal_code: address.postal_code,
                is_default: address.is_default || false,
              },
            });
          }
        }
      }

      // c. Process billing addresses
      if (body.billingAddresses && Array.isArray(body.billingAddresses)) {
        // Reset all defaults if needed
        const hasNewDefault = body.billingAddresses.some(
          (addr) => addr.is_default
        );
        const hasNewBillingDefault = body.newBillingAddresses?.some(
          (addr) => addr.is_default
        );

        if (hasNewDefault || hasNewBillingDefault) {
          await tx.billingAddress.updateMany({
            where: { userId: body.userId, is_default: true },
            data: { is_default: false },
          });
        }

        // Update existing billing addresses
        for (const billing of body.billingAddresses) {
          if (billing.id && !billing.to_delete) {
            await tx.billingAddress.update({
              where: { id: billing.id, userId: body.userId },
              data: {
                NIK: billing.NIK,
                NPWP: billing.NPWP || null,
                is_default: billing.is_default || false,
              },
            });
          }
        }
      }

      // d. Add new shipping addresses (multiple)
      if (
        body.newShippingAddresses &&
        Array.isArray(body.newShippingAddresses)
      ) {
        for (const newAddress of body.newShippingAddresses) {
          await tx.shippingAddress.create({
            data: {
              label: newAddress.label,
              address_line: newAddress.address_line,
              city: newAddress.city,
              postal_code: newAddress.postal_code,
              is_default: newAddress.is_default || false,
              userId: body.userId,
            },
          });
        }
      }
      // Backward compatibility: single new shipping address
      else if (body.newShippingAddress) {
        await tx.shippingAddress.create({
          data: {
            label: body.newShippingAddress.label,
            address_line: body.newShippingAddress.address_line,
            city: body.newShippingAddress.city,
            postal_code: body.newShippingAddress.postal_code,
            is_default: body.newShippingAddress.is_default || false,
            userId: body.userId,
          },
        });
      }

      // e. Add new billing addresses (multiple)
      if (body.newBillingAddresses && Array.isArray(body.newBillingAddresses)) {
        for (const newBilling of body.newBillingAddresses) {
          await tx.billingAddress.create({
            data: {
              NIK: newBilling.NIK,
              NPWP: newBilling.NPWP || null,
              is_default: newBilling.is_default || false,
              userId: body.userId,
            },
          });
        }
      }
      // Backward compatibility: single new billing address
      else if (body.newBillingAddress) {
        await tx.billingAddress.create({
          data: {
            NIK: body.newBillingAddress.NIK,
            NPWP: body.newBillingAddress.NPWP || null,
            is_default: body.newBillingAddress.is_default || false,
            userId: body.userId,
          },
        });
      }

      // f. Handle updated addresses (from frontend editing)
      if (body.updatedShippingAddress) {
        await tx.shippingAddress.update({
          where: { id: body.updatedShippingAddress.id, userId: body.userId },
          data: {
            label: body.updatedShippingAddress.label,
            address_line: body.updatedShippingAddress.address_line,
            city: body.updatedShippingAddress.city,
            postal_code: body.updatedShippingAddress.postal_code,
            is_default: body.updatedShippingAddress.is_default || false,
          },
        });
      }

      if (body.updatedBillingAddress) {
        await tx.billingAddress.update({
          where: { id: body.updatedBillingAddress.id, userId: body.userId },
          data: {
            NIK: body.updatedBillingAddress.NIK,
            NPWP: body.updatedBillingAddress.NPWP || null,
            is_default: body.updatedBillingAddress.is_default || false,
          },
        });
      }

      // g. Delete addresses marked for deletion
      if (body.addressesToDelete && Array.isArray(body.addressesToDelete)) {
        // Filter out temporary IDs (starting with 'temp-')
        const idsToDelete = body.addressesToDelete.filter(
          (id) => typeof id === "number" || !id.toString().startsWith("temp-")
        );

        if (idsToDelete.length > 0) {
          // Delete shipping addresses
          await tx.shippingAddress.deleteMany({
            where: {
              id: { in: idsToDelete },
              userId: body.userId,
            },
          });

          // Delete billing addresses
          await tx.billingAddress.deleteMany({
            where: {
              id: { in: idsToDelete },
              userId: body.userId,
            },
          });
        }
      }

      // h. Get updated user data with addresses
      const userWithAddresses = await tx.user.findUnique({
        where: { id: userId },
        include: {
          shippingAddresses: {
            orderBy: [{ is_default: "desc" }, { updatedAt: "desc" }],
          },
          billingAddresses: {
            orderBy: [{ is_default: "desc" }, { updatedAt: "desc" }],
          },
        },
      });

      return userWithAddresses;
    });

    // 4. Return success response
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        shippingAddresses: result.shippingAddresses,
        billingAddresses: result.billingAddresses,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle specific errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update password
export async function PATCH(request) {
  try {
    const customer = await getCustomerData();
    if (!customer || !customer.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = customer.data.id;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    const result = await updatePasswordClient(
      userId,
      currentPassword,
      newPassword
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH Password error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
