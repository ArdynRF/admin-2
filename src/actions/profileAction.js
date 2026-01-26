"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Get user profile
export async function getUserProfileClient(userId) {
  try {
    const user = await db.User.findUnique({
      where: { id: parseInt(userId) },
      include: {
        shippingAddresses: true,
        billingAddresses: true,
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Format response
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone_number || user.phone,
      shippingAddresses: user.shippingAddresses || [],
      billingAddresses: user.billingAddresses || []
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

// Update user profile
export async function updateUserProfileClient(userId, userData) {
  try {
    const { name, phone, shippingAddresses, billingAddresses, ...otherData } = userData;
    // Update basic user info
    const updatedUser = await db.User.update({
      where: { id: parseInt(userId) },
      data: {
        name,
        phone_number: phone
      }
    });

    // Revalidate path untuk refresh data
    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
}

// Update user password
export async function updatePasswordClient(userId, currentPassword, newPassword) {
  try {
    // Get user with password
    const user = await db.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        password_hash: true
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.user.update({
      where: { id: parseInt(userId) },
      data: {
        password_hash: hashedPassword,
        updated_at: new Date()
      }
    });

    return {
      success: true,
      message: "Password updated successfully"
    };
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error(error.message || "Failed to update password");
  }
}

// CRUD Shipping Addresses
export async function createShippingAddress(userId, addressData) {
  try {
    // If new address is default, set all others to non-default
    if (addressData.is_default) {
      await db.shippingAddress.updateMany({
        where: {
          user_id: parseInt(userId),
          is_deleted: false
        },
        data: { is_default: false }
      });
    }

    const newAddress = await db.shippingAddress.create({
      data: {
        user_id: parseInt(userId),
        label: addressData.label,
        address_line: addressData.address_line,
        city: addressData.city,
        postal_code: addressData.postal_code,
        is_default: addressData.is_default || false
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Shipping address added successfully",
      data: newAddress
    };
  } catch (error) {
    console.error("Error creating shipping address:", error);
    throw new Error("Failed to add shipping address");
  }
}

export async function updateShippingAddress(addressId, addressData) {
  try {
    // Get address to check user
    const address = await db.shippingAddress.findUnique({
      where: { id: parseInt(addressId) }
    });

    if (!address) {
      throw new Error("Address not found");
    }

    // If setting as default, update all other addresses
    if (addressData.is_default) {
      await db.shippingAddress.updateMany({
        where: {
          user_id: address.user_id,
          id: { not: parseInt(addressId) },
          is_deleted: false
        },
        data: { is_default: false }
      });
    }

    const updatedAddress = await db.shippingAddress.update({
      where: { id: parseInt(addressId) },
      data: {
        label: addressData.label,
        address_line: addressData.address_line,
        city: addressData.city,
        postal_code: addressData.postal_code,
        is_default: addressData.is_default
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Shipping address updated successfully",
      data: updatedAddress
    };
  } catch (error) {
    console.error("Error updating shipping address:", error);
    throw new Error("Failed to update shipping address");
  }
}

export async function deleteShippingAddress(addressId) {
  try {
    // Soft delete
    await db.shippingAddress.update({
      where: { id: parseInt(addressId) },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Shipping address deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    throw new Error("Failed to delete shipping address");
  }
}

// CRUD Billing Addresses
export async function createBillingAddress(userId, billingData) {
  try {
    // If new billing address is default, set all others to non-default
    if (billingData.is_default) {
      await db.billingAddress.updateMany({
        where: {
          user_id: parseInt(userId),
          is_deleted: false
        },
        data: { is_default: false }
      });
    }

    const newBillingAddress = await db.billingAddress.create({
      data: {
        user_id: parseInt(userId),
        NIK: billingData.NIK,
        NPWP: billingData.NPWP || null,
        is_default: billingData.is_default || false
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Billing address added successfully",
      data: newBillingAddress
    };
  } catch (error) {
    console.error("Error creating billing address:", error);
    throw new Error("Failed to add billing address");
  }
}

export async function updateBillingAddress(billingId, billingData) {
  try {
    // Get billing address to check user
    const billingAddress = await db.billingAddress.findUnique({
      where: { id: parseInt(billingId) }
    });

    if (!billingAddress) {
      throw new Error("Billing address not found");
    }

    // If setting as default, update all other addresses
    if (billingData.is_default) {
      await db.billingAddress.updateMany({
        where: {
          user_id: billingAddress.user_id,
          id: { not: parseInt(billingId) },
          is_deleted: false
        },
        data: { is_default: false }
      });
    }

    const updatedBillingAddress = await db.billingAddress.update({
      where: { id: parseInt(billingId) },
      data: {
        NIK: billingData.NIK,
        NPWP: billingData.NPWP,
        is_default: billingData.is_default
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Billing address updated successfully",
      data: updatedBillingAddress
    };
  } catch (error) {
    console.error("Error updating billing address:", error);
    throw new Error("Failed to update billing address");
  }
}

export async function deleteBillingAddress(billingId) {
  try {
    // Soft delete
    await db.billingAddress.update({
      where: { id: parseInt(billingId) },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    });

    revalidatePath("/profile");
    
    return {
      success: true,
      message: "Billing address deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting billing address:", error);
    throw new Error("Failed to delete billing address");
  }
}