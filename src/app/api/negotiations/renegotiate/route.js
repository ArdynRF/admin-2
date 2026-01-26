import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    console.log("Renegotiate request received");

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          details: parseError.message,
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const { negotiationId, quantity, offeredPrice, color, notes, productId } =
      body;

    if (!negotiationId) {
      return NextResponse.json(
        {
          success: false,
          error: "negotiationId is required",
        },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid quantity is required",
        },
        { status: 400 }
      );
    }

    if (!offeredPrice || offeredPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid offeredPrice is required",
        },
        { status: 400 }
      );
    }

    // Validate numeric values
    const parsedNegotiationId = parseInt(negotiationId);
    const parsedQuantity = parseInt(quantity);
    const parsedOfferedPrice = parseFloat(offeredPrice);

    if (isNaN(parsedNegotiationId) || parsedNegotiationId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid negotiationId format",
        },
        { status: 400 }
      );
    }

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid quantity format",
        },
        { status: 400 }
      );
    }

    if (isNaN(parsedOfferedPrice) || parsedOfferedPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid offeredPrice format",
        },
        { status: 400 }
      );
    }

    console.log("Parsed values:", {
      negotiationId: parsedNegotiationId,
      quantity: parsedQuantity,
      offeredPrice: parsedOfferedPrice,
    });

    // Check if original negotiation exists
    const originalNegotiation = await db.negotiation.findUnique({
      where: {
        id: parsedNegotiationId,
      },
      include: {
        product: {
          include: {
            colorStocks: true,
          },
        },
        user: true,
      },
    });

    if (!originalNegotiation) {
      return NextResponse.json(
        {
          success: false,
          error: "Original negotiation not found",
          negotiationId: parsedNegotiationId,
        },
        { status: 404 }
      );
    }

    console.log("Original negotiation found:", {
      id: originalNegotiation.id,
      status: originalNegotiation.status,
      userId: originalNegotiation.userId,
    });

    // Check if negotiation can be renegotiated
    const allowedStatuses = ["pending", "rejected", "expired"];
    if (!allowedStatuses.includes(originalNegotiation.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot renegotiate negotiation with status: ${originalNegotiation.status}. Only pending, rejected, or expired negotiations can be renegotiated.`,
          currentStatus: originalNegotiation.status,
        },
        { status: 400 }
      );
    }

    // Check product stock if color is specified
    if (color && originalNegotiation.product?.colorStocks?.length > 0) {
      const colorStock = originalNegotiation.product.colorStocks.find(
        (cs) => cs.color.toLowerCase() === color.toLowerCase()
      );

      if (!colorStock) {
        return NextResponse.json(
          {
            success: false,
            error: `Color '${color}' is not available for this product`,
            availableColors: originalNegotiation.product.colorStocks.map(
              (cs) => cs.color
            ),
          },
          { status: 400 }
        );
      }

      if (colorStock.stock < parsedQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for color '${color}'. Available: ${colorStock.stock}, Requested: ${parsedQuantity}`,
            availableStock: colorStock.stock,
          },
          { status: 400 }
        );
      }
    }

    // Start transaction
    const result = await db.$transaction(async (tx) => {
      // OPTION 1: Hapus negotiation lama (rekomendasi)
      const deletedOriginal = await tx.negotiation.delete({
        where: { id: parsedNegotiationId },
      });

      console.log("Original negotiation deleted:", deletedOriginal.id);

      // OPTION 2: Atau jika ingin hanya mengupdate status (simpan riwayat)
      // const updatedOriginal = await tx.negotiation.update({
      //   where: { id: parsedNegotiationId },
      //   data: {
      //     status: "renegotiated",
      //     updatedAt: new Date(),
      //     notes: `${originalNegotiation.notes || ""}\n[Renegotiated on ${new Date().toISOString()}]`.trim(),
      //   },
      // });

      // Create new negotiation
      const newNegotiation = await tx.negotiation.create({
        data: {
          userId: originalNegotiation.userId,
          productId: originalNegotiation.productId,
          quantity: parsedQuantity,
          offeredPrice: parsedOfferedPrice,
          color: color || originalNegotiation.color,
          notes: notes || `Renegotiation from offer #${parsedNegotiationId}`,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          sellerPrice: null,
          finalPrice: null,
          respondedAt: null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              mrp: true,
              description: true,
              productType: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      console.log("New negotiation created:", newNegotiation.id);

      return {
        deletedOriginal: deletedOriginal, // untuk option 1
        // originalNegotiation: updatedOriginal, // untuk option 2
        newNegotiation: newNegotiation,
      };
    });

    console.log("Renegotiation transaction completed successfully");

    // Hitung total untuk response
    const newTotal =
      result.newNegotiation.quantity * result.newNegotiation.offeredPrice;

    return NextResponse.json(
      {
        success: true,
        message:
          "Renegotiation request created successfully. Old negotiation has been deleted.",
        data: {
          newNegotiationId: result.newNegotiation.id,
          deletedNegotiationId: result.deletedOriginal.id, // ID yang dihapus
          newNegotiation: {
            id: result.newNegotiation.id,
            quantity: result.newNegotiation.quantity,
            offeredPrice: result.newNegotiation.offeredPrice,
            totalAmount: newTotal,
            color: result.newNegotiation.color,
            status: result.newNegotiation.status,
            createdAt: result.newNegotiation.createdAt,
            expiresAt: result.newNegotiation.expiresAt,
            productName: result.newNegotiation.product?.name,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Renegotiate API error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Negotiation not found or already deleted",
          code: error.code,
        },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete negotiation. There might be related data.",
          code: error.code,
          details:
            "Check if there are any constraints or foreign key references.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create renegotiation",
        details: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
