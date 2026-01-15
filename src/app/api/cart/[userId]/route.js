// app/api/seed-cart/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Clear existing cart items for user 3
    await db.cart.deleteMany({
      where: { userId: 3 },
    });
    const userIdNumber = 3;

    // Create sample cart items
    const cartItems = await db.cart.createMany({
      data: [
        // Direct Buy item
        {
          userId: 3,
          productId: 4,
          quantity: 5,
          priceTotal: 500000,
          color: "Red",
          status: "direct",
        },
        // Negotiate item
        {
          userId: 3,
          productId: 5,
          quantity: 10,
          priceTotal: 1000000,
          color: "Blue",
          status: "negotiate",
        },
        // Direct Buy item
        {
          userId: 3,
          productId: 6,
          quantity: 3,
          priceTotal: 300000,
          color: "Green",
          status: "direct",
        },
      ],
    });

    const items = await db.cart.findMany({
      where: {
        userId: userIdNumber,
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
    const formattedItems = items.map((item) => ({
      id: item.id,
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
    console.log("Seed successful:", formattedItems);
    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Seed error:", error);

    if (db) {
      await db.$disconnect();
    }

    return NextResponse.json(
      { error: "Failed to seed cart data", details: error.message },
      { status: 500 }
    );
  }
}


