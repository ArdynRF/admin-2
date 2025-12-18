"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const UPLOAD_DIR = path.resolve("public/uploads");

export const createProduct = async (formData) => {
  const imageFile = formData.get("image");
  let imageUrl = "";

  if (imageFile && typeof imageFile === "object") {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const filename = Date.now() + path.extname(imageFile.name);
    imageUrl = `uploads/${filename}`;
    const fullPath = path.join(process.cwd(), "public", imageUrl);
    await writeFile(fullPath, buffer);
  }

  const id_barang = formData.get("id_barang")?.trim();
  const name = formData.get("name");
  const description = formData.get("description");
  const mrp = parseFloat(formData.get("mrp"));
  const productTypeId = parseInt(formData.get("productType"));
  const isActive = formData.get("isActive") === "on";
  const priceTiers = JSON.parse(formData.get("priceTiers"));
  const material = formData.get("material");
  const charateristic = formData.get("charateristic");
  const moq = formData.get("moq");
  const sample_price = formData.get("sample_price");
  const isCustomization = formData.get("isCustomization") === "on";
  const weight = formData.get("weight");
  const width = formData.get("width");

  const technicIds = formData.getAll("technicIds").map((id) => parseInt(id));
  const styleIds = formData.getAll("styleIds").map((id) => parseInt(id));
  const patternIds = formData.getAll("patternIds").map((id) => parseInt(id));

  const duplicateSKU = await db.product.findUnique({ where: { id_barang } });
  if (duplicateSKU) {
    return redirect(`/products/add?errorMessage=ID Barang sudah digunakan`);
  }

  const productType = await db.productType.findUnique({
    where: { id: productTypeId },
  });
  if (!productType) {
    return redirect(`/products/add?errorMessage=Product type tidak ditemukan`);
  }

  await db.product.create({
    data: {
      id_barang,
      name,
      description,
      mrp,
      image: imageUrl,
      productTypeId,
      isActive,
      material,
      charateristic,
      moq,
      sample_price,
      isCustomization,
      weight,
      width,
      priceTiers: {
        create: priceTiers.map((tier) => ({
          minQty: parseInt(tier.minQty),
          maxQty: tier.maxQty ? parseInt(tier.maxQty) : null,
          unitPrice: parseFloat(tier.unitPrice),
        })),
      },
      technics: { connect: technicIds.map((id) => ({ id })) },
      styles: { connect: styleIds.map((id) => ({ id })) },
      patterns: { connect: patternIds.map((id) => ({ id })) },
    },
  });

  redirect("/products");
};

export async function getProducts() {
  return await db.product.findMany({
    include: {
      productType: true,
      priceTiers: true,
      technics: true,
      styles: true,
      patterns: true,
    },
  });
}

export async function getProductById(productId) {
  return await db.product.findUnique({
    where: { id: parseInt(productId) },
    include: {
      productType: true,
      priceTiers: true,
      technics: true,
      styles: true,
      patterns: true,
    },
  });
}

export async function handleDeleteImage(imagePath) {
  if (imagePath) {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

export async function editProduct(formData, productId, existingImage) {
  const imageFile = formData.get("image");
  let imageUrl = existingImage;

  if (imageFile && imageFile.size > 0) {
    await handleDeleteImage(existingImage);

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const filename = Date.now() + path.extname(imageFile.name);
    imageUrl = `uploads/${filename}`;
    const fullPath = path.join(process.cwd(), "public", imageUrl);
    await writeFile(fullPath, buffer);
  }

  const id_barang = formData.get("id_barang")?.trim();
  const name = formData.get("name");
  const description = formData.get("description");
  const mrp = parseFloat(formData.get("mrp"));
  const productTypeId = parseInt(formData.get("productType"));
  const isActive = formData.has("isActive");
  const priceTiers = JSON.parse(formData.get("priceTiers"));
  const material = formData.get("material");
  const charateristic = formData.get("charateristic");
  const moq = formData.get("moq");
  const sample_price = formData.get("sample_price");
  const isCustomization = formData.get("isCustomization") === "on";
  const weight = formData.get("weight");
  const width = formData.get("width");

  const technicIds = formData.getAll("technicIds").map((id) => parseInt(id));
  const styleIds = formData.getAll("styleIds").map((id) => parseInt(id));
  const patternIds = formData.getAll("patternIds").map((id) => parseInt(id));

  const productType = await db.productType.findUnique({
    where: { id: productTypeId },
  });
  if (!productType) {
    return redirect(
      `/products/edit/${productId}?errorMessage=Product type tidak ditemukan`
    );
  }

  await db.product.update({
    where: { id: parseInt(productId) },
    data: {
      id_barang,
      name,
      description,
      mrp,
      image: imageUrl,
      productTypeId,
      isActive,
      material,
      charateristic,
      moq,
      sample_price,
      isCustomization,
      weight,
      width,
      priceTiers: {
        deleteMany: {},
        create: priceTiers.map((tier) => ({
          minQty: parseInt(tier.minQty),
          maxQty: tier.maxQty ? parseInt(tier.maxQty) : null,
          unitPrice: parseFloat(tier.unitPrice),
        })),
      },
      technics: {
        set: technicIds.map((id) => ({ id })),
      },
      styles: {
        set: styleIds.map((id) => ({ id })),
      },
      patterns: {
        set: patternIds.map((id) => ({ id })),
      },
    },
  });

  redirect("/products");
}

export async function deleteProduct(productId) {
  const product = await db.product.findUnique({
    where: { id: parseInt(productId) },
  });
  if (!product) throw new Error("Product not found");

  if (product.image) {
    const imagePath = path.join(process.cwd(), "public", product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await db.productPricingTier.deleteMany({
    where: { productId: parseInt(productId) },
  });

  await db.product.update({
    where: { id: parseInt(productId) },
    data: {
      technics: { set: [] },
      styles: { set: [] },
      patterns: { set: [] },
    },
  });

  await db.product.delete({ where: { id: parseInt(productId) } });
}
