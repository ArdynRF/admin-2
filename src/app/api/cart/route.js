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
      message: "Cart telah berhasil ditambahkan",
      data: newCart,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something Went Wrong", error: error.message },
      { status: 500 }
    );
  }
}

// app/api/cart/route.js
export async function DELETE(request) {
  try {
    // Parse request body
    const { cartId, cartIds } = await request.json();

    console.log("Received for deletion - cartId:", cartId, "cartIds:", cartIds);

    // Tentukan ID mana yang akan dihapus
    let idsToDelete = [];

    if (cartIds && Array.isArray(cartIds)) {
      // Jika ada array cartIds, gunakan itu
      idsToDelete = cartIds;
    } else if (cartId) {
      // Jika ada single cartId, konversi ke array
      idsToDelete = [cartId];
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Cart ID(s) is required",
        },
        { status: 400 }
      );
    }

    // Validasi dan konversi ke number
    const validIds = idsToDelete
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id) && id > 0);

    if (validIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid cart IDs provided",
        },
        { status: 400 }
      );
    }

    console.log("Deleting cart items with IDs:", validIds);

    // Hapus cart item(s)
    const result = await db.cart.deleteMany({
      where: {
        id: {
          in: validIds,
        },
      },
    });

    console.log(`Successfully deleted ${result.count} cart item(s)`);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} cart item(s) successfully`,
      count: result.count,
      deletedIds: validIds,
    });
  } catch (error) {
    console.error("DELETE cart error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete cart item(s)",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
