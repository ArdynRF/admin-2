import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { userId } = params;
    const userIdNum = Number(userId);
    console.log("Fetching addresses for userId:", userIdNum);

    const items = await db.billingAddress.findMany({
      where: { user_id: userIdNum },
    });
    console.log(items)
    return NextResponse.json(
      { message: "Berhasil mendapatkan alamat", data: items },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mendapatkan alamat" },
      { status: 500 }
    );
  }
}
