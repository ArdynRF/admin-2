import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    // DAPATKAN PARAMS DARI URL, BUKAN CONTEXT
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const itemIdsParam = searchParams.get("item_ids");

    console.log("user_id :", userId);
    console.log("item_ids :", itemIdsParam);

    // Validate
    if (!userId) {
      return NextResponse.json(
        { message: "user_id wajib diisi" },
        { status: 400 }
      );
    }

    if (!itemIdsParam) {
      return NextResponse.json(
        { message: "item_ids wajib diisi" },
        { status: 400 }
      );
    }

    // Parse item IDs
    const itemIds = itemIdsParam
      .split(",")
      .map((id) => {
        const num = parseInt(id.trim());
        return isNaN(num) ? null : num;
      })
      .filter((id) => id !== null);

    if (itemIds.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada item IDs yang valid" },
        { status: 400 }
      );
    }

    const cartItems = await db.cart.findMany({
      where: {
        userId: parseInt(userId),
        id: {
          in: itemIds,
        },
        status: "active",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            mrp: true,
            description: true,
            moq: true,
            productType: {
              select: {
                name: true,
              },
            },
            priceTiers: {
              orderBy: {
                minQty: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    // Format response
    const formattedItems = cartItems.map((item) => ({
      id: item.id,
      cartId: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      priceTotal: item.priceTotal,
      color: item.color,
      status: item.status,
      addedAt: item.addedAt,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
            mrp: item.product.mrp,
            description: item.product.description,
            moq: item.product.moq,
            productType: item.product.productType?.name,
            priceTiers: item.product.priceTiers || [],
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data cart",
      count: formattedItems.length,
      data: formattedItems,
    });
  } catch (error) {
    console.error("Error in cartbyid API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
