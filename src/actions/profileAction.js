"user server";

import Label from "@/components/ui/Label";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getUserProfile(userId) {
  try {
    return await db.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        billingAddresses: true,
        shippingAddresses: true,
      },
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

export async function updateUserProfile(formData, userId) {
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const shippingAddresses = JSON.parse(formData.get("shippingAddresses") || "[]");
    const billingAddresses = JSON.parse(formData.get("billingAddresses") || "[]");
    
    await db.user.update({
        where: { id: parseInt(userId) },
        data: {
            name,
            email,
            phone,
            shippingAddresses: {
                deleteMany: {},
                create: shippingAddresses.map((address) => ({
                Label: address.Label,
                address_line: address.address_line,
                city: address.city,
                state: address.state,
                postal_code: address.postal_code,
                })),
            },
            billingAddresses: {
                deleteMany: {},
                create: billingAddresses.map((address) => ({
                NIK: address.NIK,
                NPWP: address.NPWP, 
                })),
            },
        },
    });
    revalidatePath("/profile");
    redirect("/profile");
}
