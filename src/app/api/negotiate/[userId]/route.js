import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Clear existing negotiation items for user 3

    const checkData = await db.negotiation.findMany({
      where: { userId: 3 },
    });

    if (checkData.length > 0) {
      await db.negotiation.deleteMany({
        where: { userId: 3 },
      });
    }

    const negotiations = await db.negotiation.createMany({
      data: [
        // ============ PRODUCT ID 5 ============
        // Negotiation for product 5 - APPROVED (accepted)
        {
          userId: 3,
          productId: 5,
          quantity: 8,
          offeredPrice: 85000, // User offer
          sellerPrice: 88000, // Seller counter offer
          finalPrice: 87000, // Final agreed price
          color: "Navy Blue",
          notes: "Untuk proyek kantor, bisa nego dikit lagi?",
          status: "accepted", // APPROVED
          createdAt: new Date("2024-01-03T09:20:00Z"),
          expiresAt: new Date("2024-01-10T09:20:00Z"),
          respondedAt: new Date("2024-01-04T14:30:00Z"), // Seller responded
          updatedAt: new Date("2024-01-04T14:30:00Z"),
        },

        // Negotiation for product 5 - PENDING (masih menunggu)
        {
          userId: 3,
          productId: 5,
          quantity: 15,
          offeredPrice: 82000, // Lower offer untuk quantity lebih banyak
          sellerPrice: null, // Belum ada respons
          finalPrice: null,
          color: "Charcoal Gray",
          notes: "Beli dalam jumlah besar, harga spesial dong",
          status: "pending",
          createdAt: new Date("2024-01-12T11:45:00Z"),
          expiresAt: new Date("2024-01-19T11:45:00Z"),
          respondedAt: null,
        },

        // ============ PRODUCT ID 6 ============
        // Negotiation for product 6 - REJECTED (ditolak)
        {
          userId: 3,
          productId: 6,
          quantity: 5,
          offeredPrice: 45000, // Offer terlalu rendah
          sellerPrice: 65000, // Seller's price
          finalPrice: null, // Tidak ada kesepakatan
          color: "Burgundy",
          notes: "Budget terbatas untuk event kecil",
          status: "rejected", // REJECTED
          createdAt: new Date("2024-01-05T13:15:00Z"),
          expiresAt: new Date("2024-01-12T13:15:00Z"),
          respondedAt: new Date("2024-01-06T10:20:00Z"), // Seller rejected
          updatedAt: new Date("2024-01-06T10:20:00Z"),
        },

        // Negotiation for product 6 - EXPIRED (kadaluarsa)
        {
          userId: 3,
          productId: 6,
          quantity: 10,
          offeredPrice: 58000,
          sellerPrice: null, // Seller tidak respons sampai expired
          finalPrice: null,
          color: "Olive Green",
          notes: "Butuh cepat untuk minggu depan",
          status: "expired", // EXPIRED (auto setelah expiresAt)
          createdAt: new Date("2024-01-01T08:30:00Z"),
          expiresAt: new Date("2024-01-08T08:30:00Z"), // Sudah lewat
          respondedAt: null,
        },

        // Negotiation for product 6 - APPROVED dengan harga berbeda
        {
          userId: 3,
          productId: 6,
          quantity: 20,
          offeredPrice: 55000, // Bulk discount request
          sellerPrice: 60000, // Counter offer
          finalPrice: 57500, // Middle ground
          color: "Royal Blue",
          notes: "Untuk reseller, harga grosir ya",
          status: "accepted", // APPROVED
          createdAt: new Date("2024-01-07T16:40:00Z"),
          expiresAt: new Date("2024-01-14T16:40:00Z"),
          respondedAt: new Date("2024-01-08T09:15:00Z"),
          updatedAt: new Date("2024-01-08T09:15:00Z"),
        },
      ],
    });

    // Get all negotiations for user 3 with product details
    const negotiationItems = await db.negotiation.findMany({
      where: {
        userId: 3,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedNegotiations = negotiationItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      offeredPrice: item.offeredPrice,
      sellerPrice: item.sellerPrice,
      finalPrice: item.finalPrice,
      color: item.color,
      notes: item.notes,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      expiresAt: item.expiresAt,
      respondedAt: item.respondedAt,

      // Calculate derived fields
      totalOfferedAmount: item.offeredPrice * item.quantity,
      totalFinalAmount: item.finalPrice
        ? item.finalPrice * item.quantity
        : null,
      daysRemaining: item.expiresAt
        ? Math.ceil(
            (new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
          )
        : null,

      // Product details
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
            // Calculate price difference percentage
            priceDifference: item.offeredPrice
              ? (
                  ((item.offeredPrice - item.product.mrp) / item.product.mrp) *
                  100
                ).toFixed(1)
              : null,
          }
        : null,

      // User details
      user: item.user
        ? {
            id: item.user.id,
            name: item.user.name,
            email: item.user.email,
          }
        : null,
    }));

    console.log(
      `Seed successful: ${formattedNegotiations.length} negotiation items created`
    );

    // // Check for accepted negotiations and add to cart automatically
    // const acceptedNegotiations = formattedNegotiations.filter(
    //   (item) => item.status === "accepted"
    // );

    // if (acceptedNegotiations.length > 0) {
    //   console.log(
    //     `Found ${acceptedNegotiations.length} accepted negotiations to add to cart`
    //   );

    //   for (const negotiation of acceptedNegotiations) {
    //     // Check if item already exists in cart
    //     const existingCartItem = await db.cart.findFirst({
    //       where: {
    //         userId: 3,
    //         productId: negotiation.productId,
    //         status: "negotiate",
    //       },
    //     });

    //     if (!existingCartItem && negotiation.finalPrice) {
    //       // Add to cart
    //       await db.cart.create({
    //         data: {
    //           userId: 3,
    //           productId: negotiation.productId,
    //           quantity: negotiation.quantity,
    //           priceTotal: negotiation.finalPrice * negotiation.quantity,
    //           color: negotiation.color,
    //           status: "negotiate",
    //           addedAt: new Date(),
    //         },
    //       });
    //       console.log(
    //         `Added product ${negotiation.productId} to cart from negotiation ${negotiation.id}`
    //       );
    //     }
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${formattedNegotiations.length} negotiation items`,
      count: formattedNegotiations.length,
      data: formattedNegotiations,
      summary: {
        pending: formattedNegotiations.filter(
          (item) => item.status === "pending"
        ).length,
        accepted: formattedNegotiations.filter(
          (item) => item.status === "accepted"
        ).length,
        rejected: formattedNegotiations.filter(
          (item) => item.status === "rejected"
        ).length,
        expired: formattedNegotiations.filter(
          (item) => item.expiresAt && new Date(item.expiresAt) < new Date()
        ).length,
      },
    });
  } catch (error) {
    console.error("Negotiation seed error:", error);

    if (db) {
      await db.$disconnect();
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed negotiation data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
