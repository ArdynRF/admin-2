// app/api/negotiations/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    // console.log("DELETE request received");

    // Parse request body
    let negotiationIds;
    try {
      const body = await request.json();
      //   console.log("Request body:", body);

      // Support multiple formats
      if (body.negotiationIds && Array.isArray(body.negotiationIds)) {
        negotiationIds = body.negotiationIds;
      } else if (body.negotiationId) {
        negotiationIds = [body.negotiationId];
      } else if (body.id) {
        negotiationIds = [body.id];
      } else if (Array.isArray(body)) {
        negotiationIds = body;
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid request format. Use {negotiationIds: [1,2,3]} or {negotiationId: 1}",
            received: body,
          },
          { status: 400 }
        );
      }
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

    // console.log("Deleting negotiations with IDs:", negotiationIds);

    // Validate IDs
    const validIds = negotiationIds
      .map((id) => {
        const num = parseInt(id);
        return isNaN(num) || num <= 0 ? null : num;
      })
      .filter((id) => id !== null);

    if (validIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid negotiation IDs provided",
          received: negotiationIds,
        },
        { status: 400 }
      );
    }

    // console.log("Valid IDs to delete:", validIds);

    // Check if negotiations exist before deleting
    const existingNegotiations = await db.negotiation.findMany({
      where: {
        id: {
          in: validIds,
        },
      },
      select: {
        id: true,
        status: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const existingIds = existingNegotiations.map((n) => n.id);

    // Delete negotiations
    const result = await db.negotiation.deleteMany({
      where: {
        id: {
          in: existingIds,
        },
      },
    });

    // console.log(`Successfully deleted ${result.count} negotiation(s)`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} negotiation(s)`,
      count: result.count,
    });
  } catch (error) {
    console.error("DELETE negotiations error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "One or more negotiations not found",
          code: error.code,
          meta: error.meta,
        },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Foreign key constraint violation",
          code: error.code,
          details: "Cannot delete due to existing references",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete negotiations",
        details: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
  }
}
// export async function GET(request) {
//   try {
//     const negotiations = await db.negotiation.findMany({
//       take: 10,
//       orderBy: {
//         createdAt: 'desc'
//       },
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true
//           }
//         },
//         user: {
//           select: {
//             id: true,
//             name: true
//           }
//         }
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       count: negotiations.length,
//       data: negotiations,
//       endpoint: "/api/negotiations",
//       method: "GET",
//       note: "Use DELETE method to delete negotiations"
//     });

//   } catch (error) {
//     console.error("GET negotiations error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch negotiations", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request) {
  try {
    const body = await request.json();
    const { negotiationId } = body;

    const negotiation = await db.negotiation.findUnique({
      where: { id: parseInt(negotiationId) },
      include: {
        product: true,
        user: true,
      },
    });


    if (negotiation.status !== "accepted") {
      return NextResponse.json(
        { error: "Only accepted negotiations can be moved to cart" },
        { status: 400 }
      );
    }

    const existingCart = await db.cart.findUnique({
      where: {
        userId_productId: {
          userId: negotiation.userId,
          productId: negotiation.productId,
        },
      },
    });

    
    const result = await db.$transaction(async (tx) => {
      
      const updatedNegotiation = await tx.negotiation.delete({
        where: { id: parseInt(negotiationId) },
        data: {
          status: "completed",
          updatedAt: new Date(),
        },
      });

  
      const finalPrice = negotiation.finalPrice || negotiation.offeredPrice;
      const priceTotal = Math.round(finalPrice * negotiation.quantity);

      if (existingCart) {
        const updatedCart = await tx.cart.update({
          where: {
            userId_productId: {
              userId: negotiation.userId,
              productId: negotiation.productId,
            },
          },
          data: {
            quantity: existingCart.quantity + negotiation.quantity,
            priceTotal: existingCart.priceTotal + priceTotal,
            addedAt: new Date(),
          },
        });
        return {
          negotiation: updatedNegotiation,
          cart: updatedCart,
          action: "updated",
        };
      } else {
        // Jika belum ada, buat cart baru
        const newCart = await tx.cart.create({
          data: {
            userId: negotiation.userId,
            productId: negotiation.productId,
            quantity: negotiation.quantity,
            priceTotal: priceTotal,
            color: negotiation.color || null,
            status: "pending",
            addedAt: new Date(),
          },
        });
        return {
          negotiation: updatedNegotiation,
          cart: newCart,
          action: "created",
        };
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully moved negotiation to cart (${result.action})`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE negotiations error:", error);
    return NextResponse.json(
      {
        error: "Failed to update negotiations",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
