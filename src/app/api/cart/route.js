import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, productId, quantity, question } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "userId dan productId wajib diisi" },
        { status: 400 }
      );
    }

    const newCart = await db.Cart.create({
      data: {
        userId,
        productId,
        quantity: quantity || 1,
        question: question || null,
      },
    });

    return NextResponse.json({
      message: "Cart berhasil ditambahkan",
      data: newCart,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something Went Wrong", error: error.message },
      { status: 500 }
    );
  }
}
