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
