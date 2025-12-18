import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    const carts = await db.cart.findMany({
      where: { userId: Number(userId) },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      message: "Cart berhasil diambil",
      data: carts,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something Went Wrong", error: error.message },
      { status: 500 }
    );
  }
}
