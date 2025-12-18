import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, context) {
  const params = await context.params; // ⬅️ PENTING: await dulu sebelum digunakan
  const { productId } = params;

  const id = Number(productId);
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required and must be a number." },
      { status: 400 }
    );
  }

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        productType: true,
        technics: true,
        styles: true,
        patterns: true,
        priceTiers: true,
        colorStocks: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Product fetched successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", detail: error.message },
      { status: 500 }
    );
  }
}
