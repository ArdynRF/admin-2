"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getNegotiates() {
  try {
    const negotiates = await db.negotiation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return negotiates;
  } catch (error) {
    console.error("Error fetching negotiates:", error);
    // Kembalikan array kosong jika ada error
    return [];
  }
}

export async function getNegotiateById(id) {
  try {
    const negotiate = await db.negotiation.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!negotiate) {
      throw new Error("Negotiate not found");
    }

    return negotiate;
  } catch (error) {
    console.error("Error fetching negotiate by id:", error);
    throw new Error("Failed to fetch negotiate details");
  }
}

export async function deleteNegotiate(id) {
  try {
    await db.negotiation.delete({
      where: { id: parseInt(id) },
    });
    
    // Revalidate path untuk refresh data
    revalidatePath("/negotiate");
    
    return { success: true, message: "Negotiate deleted successfully" };
  } catch (error) {
    console.error("Error deleting negotiate:", error);
    return { success: false, message: "Failed to delete negotiate" };
  }
}

// Tambahkan fungsi ini di negotiateActions.js
export async function updateNegotiate(id, formData) {
  try {
    console.log("Updating negotiate with ID:", id);
    console.log("Update data:", formData);
    
    // Data yang akan diupdate - HANYA status dan notes
    const updateData = {
      status: formData.status,
      notes: formData.notes || null,
    };
    
    // Jika status berubah dari pending, set respondedAt
    if (formData.status !== "pending") {
      updateData.respondedAt = new Date();
    }
    
    // Update finalPrice berdasarkan status
    if (formData.status === "accepted") {
      updateData.finalPrice = formData.finalPrice || null;
    }
    
    let updatedNegotiate = null;
    
    if (db.negotiation) {
      updatedNegotiate = await db.negotiation.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
    } else if (db.negotiate) {
      updatedNegotiate = await db.negotiate.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
    }
    
    console.log("Negotiate updated successfully");
    return { success: true, data: updatedNegotiate };
  } catch (error) {
    console.error("Error updating negotiate:", error);
    throw new Error("Failed to update negotiate");
  }
}