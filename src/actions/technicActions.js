"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 🔧 CREATE
export async function createTechnic(formData) {
  const name = formData.get("name");

  const exists = await db.technic.findUnique({ where: { name } });
  if (exists)
    return redirect(`/technic/add?errorMessage=Technic already exists.`);

  await db.technic.create({ data: { name } });
  revalidatePath("/technic", "page");
  redirect("/technic");
}

// 📥 GET MANY
export async function getTechnics() {
  return await db.technic.findMany();
}

// 🔍 GET UNIQUE
export async function getUniqueTechnic(id) {
  return await db.technic.findUnique({ where: { id: parseInt(id) } });
}

// 📝 UPDATE
export async function updateTechnic(formData, id) {
  const name = formData.get("name");

  await db.technic.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  revalidatePath("/technic", "page");
  redirect("/technic");
}

// ❌ DELETE
export async function deleteTechnic(id) {
  await db.technic.delete({ where: { id: parseInt(id) } });
  revalidatePath("/technic", "page");
}
