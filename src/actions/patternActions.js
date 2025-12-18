"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPattern(formData) {
  const name = formData.get("name");

  const exists = await db.pattern.findUnique({ where: { name } });
  if (exists)
    return redirect(`/pattern/add?errorMessage=Pattern already exists.`);

  await db.pattern.create({ data: { name } });
  revalidatePath("/pattern", "page");
  redirect("/pattern");
}

export async function getPatterns() {
  return await db.pattern.findMany();
}

export async function getUniquePattern(id) {
  return await db.pattern.findUnique({ where: { id: parseInt(id) } });
}

export async function updatePattern(formData, id) {
  const name = formData.get("name");

  await db.pattern.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  revalidatePath("/pattern", "page");
  redirect("/pattern");
}

export async function deletePattern(id) {
  await db.pattern.delete({ where: { id: parseInt(id) } });
  revalidatePath("/pattern", "page");
}
