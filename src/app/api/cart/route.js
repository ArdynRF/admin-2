import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/cart/route.js
export async function DELETE(request) {
  try {
    // Parse request body
    const { cartId, cartIds } = await request.json();

    // console.log("Received for deletion - cartId:", cartId, "cartIds:", cartIds);

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

    // console.log("Deleting cart items with IDs:", validIds);

    // Hapus cart item(s)
    const result = await db.cart.deleteMany({
      where: {
        id: {
          in: validIds,
        },
      },
    });

    // console.log(`Successfully deleted ${result.count} cart item(s)`);

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

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      productId,
      quantity,
      price,
      notes,
      transactionType,
      colorId,
      colorData,
    } = body;

    let result;

    if (transactionType === "directly") {
      // Logic untuk langsung beli (masuk ke Cart)
      result = await handleDirectPurchase(db, body);
    } else if (transactionType === "negotiate") {
      // Logic untuk negosiasi (masuk ke Negotiation)
      result = await handleNegotiation(db, body);
    }

    return NextResponse.json(
      {
        message: "Berhasil diproses",
        transactionType,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in cart API:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
        error: error.message,
        details: error.code,
      },
      { status: 500 }
    );
  }
}

// Fungsi untuk handle pembelian langsung
async function handleDirectPurchase(db, data) {
  const {
    userId,
    productId,
    quantity,
    price,
    colorId,
    colorData,
    colorName,
    notes,
  } = data;

  // Cek apakah sudah ada di cart dengan status 'active'
  const existingCart = await db.cart.findFirst({
    where: {
      userId,
      productId,
      color: colorName,
      status: "active",
    },
  });
  
  if (existingCart) {
    // Update quantity dan price jika sudah ada
    const updatedCart = await db.cart.update({
      where: { id: existingCart.id },
      data: {
        quantity: existingCart.quantity + quantity,
        priceTotal: existingCart.priceTotal + (price * quantity),
        status: "active",
      },
    });

    // Update stock warna jika colorId diberikan
    // if (colorId) {
    //   await updateColorStock(db, colorId, quantity);
    // }

    return updatedCart;
  } else {
    // Buat cart baru
    const newCart = await db.cart.create({
      data: {
        userId,
        productId,
        quantity,
        priceTotal : price * quantity,
        color: colorName,
        status: "active",
      },
      include: {
        product: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update stock warna jika colorId diberikan
    // if (colorId) {
    //   await updateColorStock(db, colorId, quantity);
    // }

    return newCart;
  }
}

// Fungsi untuk handle negosiasi
async function handleNegotiation(db, data) {
  const {
    userId,
    productId,
    quantity,
    price,
    colorId,
    colorData,
    colorName,
    notes,
  } = data;

  // Cek apakah sudah ada negotiation pending untuk user dan product ini
  const existingNegotiation = await db.negotiation.findFirst({
    where: {
      userId,
      productId,
      status: "pending",
      color: colorName,
    },
  });

  // Buat negotiation baru
  const newNegotiation = await db.negotiation.create({
    data: {
      userId,
      productId,
      quantity,
      offeredPrice: price,
      notes: notes || null,
      color: colorName,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    },
    include: {
      product: {
        select: {
          name: true,
          image: true,
          priceTiers: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return newNegotiation;
}

// Fungsi untuk update stock warna
async function updateColorStock(db, colorId, quantity) {
  const colorStock = await db.ProductColorStock.findUnique({
    where: { id: colorId },
  });

  if (colorStock) {
    const newStock = colorStock.stock - quantity;
    if (newStock < 0) {
      throw new Error(`Stok tidak mencukupi untuk warna ${colorStock.color}`);
    }

    await db.ProductColorStock.update({
      where: { id: colorId },
      data: { stock: newStock },
    });
  }
}
