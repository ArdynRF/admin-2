import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    console.log(userId);

    const carts = await db.cart.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        product: true,
      },
    });

    console.log(carts);
    return NextResponse.json(carts);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
