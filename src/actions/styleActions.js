"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStyle(formData) {
  const name = formData.get("name");

  const exists = await db.style.findUnique({ where: { name } });
  if (exists)
    return redirect(`/style-type/add?errorMessage=Style already exists.`);

  await db.style.create({ data: { name } });
  revalidatePath("/style-type", "page");
  redirect("/style-type");
}

export async function getStyles() {
  return await db.style.findMany();
}

export async function getUniqueStyle(id) {
  return await db.style.findUnique({ where: { id: parseInt(id) } });
}

export async function updateStyle(formData, id) {
  const name = formData.get("name");

  await db.style.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  revalidatePath("/style-type", "page");
  redirect("/style-type");
}

export async function deleteStyle(id) {
  await db.style.delete({ where: { id: parseInt(id) } });
  revalidatePath("/style-type", "page");
}
