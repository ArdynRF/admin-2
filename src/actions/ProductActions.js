"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const UPLOAD_DIR = path.resolve("public/uploads");

// Pastikan direktori upload ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Fungsi helper untuk generate nama file yang unik
function generateUniqueFilename(originalName, prefix = "") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${prefix}${timestamp}_${random}${ext}`;
}

// Fungsi untuk upload file
async function uploadFile(file, filenamePrefix = "") {
  if (!file || typeof file !== "object" || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = generateUniqueFilename(file.name, filenamePrefix);
  const imageUrl = `uploads/${filename}`;
  const fullPath = path.join(process.cwd(), "public", imageUrl);

  await writeFile(fullPath, buffer);
  return imageUrl;
}

export const createProduct = async (formData) => {
  try {
    console.log("=== START CREATE PRODUCT ===");

    // 1. Handle Main Image
    const imageFile = formData.get("image");
    let imageUrl = "";

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      console.log("Uploading main image...");
      imageUrl = await uploadFile(imageFile, "main_");
      console.log("Main image uploaded:", imageUrl);
    }

    // 2. Handle Additional Images (multiple)
    const additionalImageFiles = formData.getAll("additionalImages");
    console.log(
      "Total additional images received:",
      additionalImageFiles.length,
    );

    const uploadedImages = [];
    let uploadCount = 0;

    for (let i = 0; i < additionalImageFiles.length; i++) {
      const imageFile = additionalImageFiles[i];

      // Skip file yang kosong
      if (!imageFile || typeof imageFile !== "object" || imageFile.size === 0) {
        console.log(`Skipping empty file at index ${i}`);
        continue;
      }

      console.log(
        `Processing additional image ${i + 1}:`,
        imageFile.name,
        "size:",
        imageFile.size,
      );

      try {
        const imageUrl = await uploadFile(imageFile, `additional_`);
        console.log(`Uploaded additional image ${i + 1}:`, imageUrl);

        uploadedImages.push({
          url: imageUrl,
          order: uploadCount, // Gunakan uploadCount sebagai order
        });

        uploadCount++;
      } catch (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError);
      }
    }

    console.log("Total images uploaded to server:", uploadedImages.length);
    console.log("Images data:", uploadedImages);

    // 3. Get other form data
    const id_barang = formData.get("id_barang")?.trim();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const productTypeId = parseInt(formData.get("productType"));
    const isActive = formData.get("isActive") === "on";
    const priceTiers = JSON.parse(formData.get("priceTiers") || "[]");
    const material = formData.get("material");
    const charateristic = formData.get("charateristic");
    const moq = formData.get("moq");
    const sample_price = formData.get("sample_price");
    const isCustomization = formData.get("isCustomization") === "on";
    const weight = formData.get("weight");
    const width = formData.get("width");

    const colorVariants = JSON.parse(formData.get("colorVariants") || "[]");
    const sampleProducts = JSON.parse(formData.get("sampleProducts") || "[]");

    const technicIds = formData.getAll("technicIds").map((id) => parseInt(id));
    const styleIds = formData.getAll("styleIds").map((id) => parseInt(id));
    const patternIds = formData.getAll("patternIds").map((id) => parseInt(id));

    // 4. Validations
    const duplicateSKU = await db.product.findUnique({ where: { id_barang } });
    if (duplicateSKU) {
      return redirect(`/products/add?errorMessage=ID Barang sudah digunakan`);
    }

    const productType = await db.productType.findUnique({
      where: { id: productTypeId },
    });
    if (!productType) {
      return redirect(
        `/products/add?errorMessage=Product type tidak ditemukan`,
      );
    }

    // 5. Create product with images
    console.log("Creating product in database...");
    const newProduct = await db.product.create({
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
        sampleProducts:
          sampleProducts.length > 0
            ? {
                create: sampleProducts.map((variant) => ({
                  color_sample: variant.color_sample,
                  stock_sample: parseInt(variant.stock_sample) || 0,
                })),
              }
            : undefined,
        colorStocks:
          colorVariants.length > 0
            ? {
                create: colorVariants.map((variant) => ({
                  color: variant.colorName,
                  stock: parseInt(variant.stock) || 0,
                })),
              }
            : undefined,
        priceTiers: {
          create: priceTiers.map((tier) => ({
            minQty: parseInt(tier.minQty),
            maxQty: tier.maxQty ? parseInt(tier.maxQty) : null,
            unitPrice: parseFloat(tier.unitPrice),
          })),
        },
        // Tambahkan multiple images jika ada
        images:
          uploadedImages.length > 0
            ? {
                create: uploadedImages,
              }
            : undefined,
        technics: { connect: technicIds.map((id) => ({ id })) },
        styles: { connect: styleIds.map((id) => ({ id })) },
        patterns: { connect: patternIds.map((id) => ({ id })) },
      },
      include: {
        images: true,
      },
    });

    console.log("Product created successfully. ID:", newProduct.id);
    console.log("Total images saved in DB:", newProduct.images.length);
    console.log("=== END CREATE PRODUCT ===");

    redirect("/products");
  } catch (error) {
    console.error("Create product error:", error);
    return redirect(
      `/products/add?errorMessage=${encodeURIComponent(error.message)}`,
    );
  }
};

export async function getProducts() {
  return await db.product.findMany({
    include: {
      productType: true,
      priceTiers: true,
      technics: true,
      styles: true,
      patterns: true,
      colorStocks: true,
      images: { orderBy: { order: "asc" } }, // Tambahkan images
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
      colorStocks: true,
      sampleProducts: true,
      images: { orderBy: { order: "asc" } }, // Tambahkan images
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

// Fungsi untuk delete multiple images
export async function handleDeleteImages(imagePaths) {
  if (!Array.isArray(imagePaths)) return;

  for (const imagePath of imagePaths) {
    if (imagePath) {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  }
}

export async function editProduct(formData, productId, existingImage) {
  try {
    console.log("=== START EDIT PRODUCT ===");

    // 1. Get existing product
    const existingProduct = await db.product.findUnique({
      where: { id: parseInt(productId) },
      include: { images: true },
    });

    if (!existingProduct) {
      return redirect(
        `/products/edit/${productId}?errorMessage=Product tidak ditemukan`,
      );
    }

    console.log("Existing images:", existingProduct.images.length);

    // 2. Handle Main Image
    const imageFile = formData.get("image");
    let imageUrl = existingImage;

    if (imageFile && imageFile.size > 0) {
      console.log("Updating main image...");

      // Delete old main image
      if (existingImage) {
        await handleDeleteImage(existingImage);
      }

      // Upload new main image
      imageUrl = await uploadFile(imageFile, "main_");
      console.log("New main image:", imageUrl);
    }

    // 3. Handle Additional Images
    const existingAdditionalImages = JSON.parse(
      formData.get("existingAdditionalImages") || "[]",
    );

    // Images to keep from existing ones
    const imagesToKeep = existingAdditionalImages.filter(
      (img) => img.keep === true,
    );
    console.log("Images to keep:", imagesToKeep.length);

    // Images to delete
    const imagesToDelete = existingAdditionalImages.filter(
      (img) => img.keep === false,
    );
    console.log("Images to delete:", imagesToDelete.length);

    // Delete files from server
    if (imagesToDelete.length > 0) {
      const deletePaths = imagesToDelete.map((img) => img.url);
      await handleDeleteImages(deletePaths);
    }

    // Upload new additional images
    const newImageFiles = formData.getAll("additionalImages");
    console.log("New images to upload:", newImageFiles.length);

    const uploadedImages = [];
    let orderCounter = imagesToKeep.length;

    for (let i = 0; i < newImageFiles.length; i++) {
      const imageFile = newImageFiles[i];

      if (imageFile && imageFile.size > 0) {
        console.log(`Uploading new image ${i + 1}...`);

        const newImageUrl = await uploadFile(imageFile, `additional_`);

        uploadedImages.push({
          url: newImageUrl,
          order: orderCounter,
        });

        orderCounter++;
        console.log(`Uploaded: ${newImageUrl}`);
      }
    }

    // Combine all images
    const allImages = [
      ...imagesToKeep.map((img) => ({
        url: img.url,
        order: img.order || 0,
      })),
      ...uploadedImages,
    ];

    console.log("Total images after edit:", allImages.length);

    // 4. Get other form data (sama seperti sebelumnya)
    const id_barang = formData.get("id_barang")?.trim();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const productTypeId = parseInt(formData.get("productType"));
    const isActive = formData.has("isActive");
    const priceTiers = JSON.parse(formData.get("priceTiers") || "[]");
    const material = formData.get("material");
    const charateristic = formData.get("charateristic");
    const moq = formData.get("moq");
    const sample_price = formData.get("sample_price");
    const isCustomization = formData.get("isCustomization") === "on";
    const weight = formData.get("weight");
    const width = formData.get("width");

    const colorStocks = JSON.parse(formData.get("colorStocks") || "[]");
    const sampleProducts = JSON.parse(formData.get("sampleProducts") || "[]");

    const technicIds = formData.getAll("technicIds").map((id) => parseInt(id));
    const styleIds = formData.getAll("styleIds").map((id) => parseInt(id));
    const patternIds = formData.getAll("patternIds").map((id) => parseInt(id));

    const productType = await db.productType.findUnique({
      where: { id: productTypeId },
    });
    if (!productType) {
      return redirect(
        `/products/edit/${productId}?errorMessage=Product type tidak ditemukan`,
      );
    }

    // 5. Update product
    const updatedProduct = await db.product.update({
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
        sampleProducts: {
          deleteMany: {},
          create: sampleProducts.map((variant) => ({
            color_sample: variant.color_sample,
            stock_sample: parseInt(variant.stock_sample) || 0,
          })),
        },
        colorStocks: {
          deleteMany: {},
          create: colorStocks.map((variant) => ({
            color: variant.color,
            stock: parseInt(variant.stock) || 0,
          })),
        },
        images: {
          deleteMany: {},
          create: allImages,
        },
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
      include: {
        images: true,
      },
    });

    console.log(
      "Product updated successfully. Total images:",
      updatedProduct.images.length,
    );
    console.log("=== END EDIT PRODUCT ===");

    redirect("/products");
  } catch (error) {
    console.error("Edit product error:", error);
    return redirect(
      `/products/edit/${productId}?errorMessage=${encodeURIComponent(error.message)}`,
    );
  }
}

export async function deleteProduct(productId) {
  try {
    console.log(`=== START DELETE PRODUCT ID: ${productId} ===`);

    const productIdInt = parseInt(productId);

    // 1. Cari product untuk mendapatkan image path
    const product = await db.product.findUnique({
      where: { id: productIdInt },
      include: { images: true },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    console.log(`Deleting product: ${product.name}`);

    // 2. HAPUS DALAM URUTAN YANG BENAR:
    // Urutan: Child tables -> Junction tables -> Parent table

    // a) Hapus ProductImages terlebih dahulu
    try {
      await db.productImage.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("ProductImage records deleted");

      // Delete image files
      if (product.images && product.images.length > 0) {
        const imagePaths = product.images.map((img) => img.url);
        await handleDeleteImages(imagePaths);
      }
    } catch (e) {
      console.log("No ProductImage records or error:", e.message);
    }

    // b) Hapus dari OrderItem (set null karena mungkin diperlukan untuk history)
    try {
      await db.orderItem.updateMany({
        where: { productId: productIdInt },
        data: { productId: null },
      });
      console.log("OrderItem records updated (set to null)");
    } catch (e) {
      console.log("No OrderItem records or error:", e.message);
    }

    // c) Hapus dari Cart
    try {
      await db.cart.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("Cart records deleted");
    } catch (e) {
      console.log("No Cart records or error:", e.message);
    }

    // d) Hapus dari Negotiation
    try {
      await db.negotiation.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("Negotiation records deleted");
    } catch (e) {
      console.log("No Negotiation records or error:", e.message);
    }

    // e) Hapus ProductPricingTier
    try {
      await db.productPricingTier.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("ProductPricingTier records deleted");
    } catch (e) {
      console.log("No ProductPricingTier records or error:", e.message);
    }

    // f) Hapus ProductColorStock
    try {
      await db.productColorStock.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("ProductColorStock records deleted");
    } catch (e) {
      console.log("No ProductColorStock records or error:", e.message);
    }

    // g) Hapus ProductSample
    try {
      await db.productSample.deleteMany({
        where: { productId: productIdInt },
      });
      console.log("ProductSample records deleted");
    } catch (e) {
      console.log("No ProductSample records or error:", e.message);
    }

    // h) HAPUS JUNCTION TABLES (Many-to-Many Relations)
    try {
      // Technic junction
      await db.$executeRaw`
        DELETE FROM _ProductToTechnic 
        WHERE A = ${productIdInt} OR B = ${productIdInt}
      `;
      console.log("_ProductToTechnic junction records deleted");
    } catch (e) {
      console.log("No _ProductToTechnic records or error:", e.message);
    }

    try {
      // Style junction
      await db.$executeRaw`
        DELETE FROM _ProductToStyle 
        WHERE A = ${productIdInt} OR B = ${productIdInt}
      `;
      console.log("_ProductToStyle junction records deleted");
    } catch (e) {
      console.log("No _ProductToStyle records or error:", e.message);
    }

    try {
      // Pattern junction
      await db.$executeRaw`
        DELETE FROM _ProductToPattern 
        WHERE A = ${productIdInt} OR B = ${productIdInt}
      `;
      console.log("_ProductToPattern junction records deleted");
    } catch (e) {
      console.log("No _ProductToPattern records or error:", e.message);
    }

    // 3. Hapus main image file
    if (product.image && product.image.trim() !== "") {
      try {
        const imagePath = path.join(process.cwd(), "public", product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Main image file deleted:", product.image);
        }
      } catch (imageError) {
        console.warn("Could not delete main image:", imageError.message);
      }
    }

    // 4. SEKARANG baru hapus product itu sendiri
    console.log("Attempting to delete main product record...");
    await db.product.delete({
      where: { id: productIdInt },
    });

    console.log(`=== SUCCESS: Product ${productId} deleted ===`);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("=== FINAL DELETE ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error meta:", error.meta);

    // Debug: Cek apakah masih ada relasi yang tersisa
    try {
      console.log("=== DEBUG: Checking remaining relations ===");

      const checks = [
        {
          name: "ProductImage",
          query: db.productImage.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "OrderItem",
          query: db.orderItem.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "Cart",
          query: db.cart.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "Negotiation",
          query: db.negotiation.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "ProductPricingTier",
          query: db.productPricingTier.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "ProductColorStock",
          query: db.productColorStock.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
        {
          name: "ProductSample",
          query: db.productSample.findMany({
            where: { productId: parseInt(productId) },
          }),
        },
      ];

      for (const check of checks) {
        try {
          const results = await check.query;
          if (results.length > 0) {
            console.error(
              `❌ Still have ${results.length} records in ${check.name}`,
            );
          } else {
            console.log(`✓ No records in ${check.name}`);
          }
        } catch (e) {
          console.log(`? Could not check ${check.name}:`, e.message);
        }
      }
    } catch (debugError) {
      console.log("Debug check failed:", debugError.message);
    }

    // Berikan pesan error yang lebih spesifik
    let userMessage = "Failed to delete product";
    if (error.code === "P2003") {
      userMessage =
        "Cannot delete product because it is still referenced in other records. Please check carts, negotiations, or order history.";
    } else if (error.message.includes("foreign key constraint")) {
      userMessage =
        "Database constraint violation. The product is still linked to other records.";
    }

    throw new Error(`${userMessage}: ${error.message}`);
  }
}
