import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const orderData = await request.json();
    console.log("Received order data:", JSON.stringify(orderData, null, 2));

    if (!orderData.userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one item is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    if (!orderData.address) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipping address is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    if (!orderData.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    if (!orderData.shippingMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipping method is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    // Validasi numeric values
    if (typeof orderData.subtotal !== "number" || orderData.subtotal <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid subtotal is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    if (typeof orderData.total !== "number" || orderData.total <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid total is required",
          received: orderData,
        },
        { status: 400 }
      );
    }

    // Generate order number jika tidak ada
    const orderNumber =
      orderData.orderNumber ||
      generateOrderNumber(orderData.orderType || "cart");

    console.log("Creating order with number:", orderNumber);

    // Mulai transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          userId: parseInt(orderData.userId),
          orderNumber: orderNumber,
          status: orderData.orderStatus || "processing",
          paymentStatus: orderData.paymentStatus || "down_payment_paid",
          paymentMethod: orderData.paymentMethod,
          shippingAddress: orderData.address,
          billingAddress: orderData.billing || null,
          shippingMethod: orderData.shippingMethod,
          shippingCost: parseFloat(orderData.shippingCost) || 0,
          subtotal: parseFloat(orderData.subtotal) || 0,
          tax: parseFloat(orderData.tax) || 0,
          total: parseFloat(orderData.total) || 0,
          downPayment: parseFloat(orderData.downPayment) || 0,
          remainingPayment: parseFloat(orderData.remainingPayment) || 0,
          orderDate: new Date(),
          estimatedDelivery: calculateEstimatedDelivery(
            orderData.shippingMethod
          ),
        },
      });

      console.log("Order created:", order.id);

      // 2. Create order items
      const orderItems = await Promise.all(
        orderData.items.map(async (item) => {
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: parseInt(item.productId),
              productName: item.productName || "Unknown Product",
              quantity: parseInt(item.quantity) || 1,
              unitPrice: parseFloat(item.unitPrice) || 0,
              totalPrice: parseFloat(item.totalPrice) || 0,
              color: item.color || null,
              productStatus: item.isSampleOrder
                ? "Sample Order"
                : item.orderStatus === "pre_order"
                  ? "Pre Order"
                  : "Regular",

              // Product snapshot
              // productImage: item.productSnapshot?.image || "",
              // productType: item.productSnapshot?.type || "",
              // productMoq: item.productSnapshot?.moq || "",
              // productMrp: parseFloat(item.productSnapshot?.mrp) || 0,
              // productDescription: item.productSnapshot?.description || "",

              // Price tiers snapshot
              // priceTiers: item.productSnapshot?.priceTiers || [],
            },
          });
          return orderItem;
        })
      );

      console.log(`Created ${orderItems.length} order items`);

      // 3. Update product stock jika diperlukan (jika bukan pre-order)
      if (
        orderData.orderStatus !== "pre_order" &&
        orderData.orderType !== "sample"
      ) {
        for (const item of orderData.items) {
          const product = await tx.product.findUnique({
            where: { id: parseInt(item.productId) },
            select: { currentStock: true },
          });

          if (product) {
            const newStock = product.currentStock - item.quantity;
            if (newStock >= 0) {
              await tx.product.update({
                where: { id: parseInt(item.productId) },
                data: { currentStock: newStock },
              });
              console.log(
                `Updated stock for product ${item.productId}: ${product.currentStock} -> ${newStock}`
              );
            } else {
              console.warn(`Insufficient stock for product ${item.productId}`);
              // Bisa throw error atau hanya log warning
            }
          }
        }
      }

      // 4. Clear cart items jika ada cartId
      if (orderData.items.some((item) => item.cartId)) {
        const cartIds = orderData.items
          .map((item) => item.cartId)
          .filter((id) => id !== null && id !== undefined);

        if (cartIds.length > 0) {
          const deleteResult = await tx.cart.deleteMany({
            where: {
              id: {
                in: cartIds.map((id) => parseInt(id)),
              },
            },
          });
          console.log(`Deleted ${deleteResult.count} cart items`);
        }
      }

      return {
        order,
        orderItems,
        itemsCount: orderItems.length,
      };
    });

    console.log("Order transaction completed successfully");

    // Prepare response data
    const responseData = {
      id: result.order.id,
      orderNumber: result.order.orderNumber,
      userId: result.order.userId,
      status: result.order.status,
      paymentStatus: result.order.paymentStatus,
      paymentMethod: result.order.paymentMethod,
      shippingAddress: result.order.shippingAddress,
      shippingMethod: result.order.shippingMethod,
      shippingCost: result.order.shippingCost,
      subtotal: result.order.subtotal,
      tax: result.order.tax,
      total: result.order.total,
      downPayment: result.order.downPayment,
      remainingPayment: result.order.remainingPayment,
      orderDate: result.order.orderDate,
      estimatedDelivery: result.order.estimatedDelivery,
      items: result.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        color: item.color,
        productImage: item.productImage,
        productType: item.productType,
      })),
      itemsCount: result.itemsCount,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Order number already exists",
          details: "Please try again with a different order number",
          code: error.code,
        },
        { status: 409 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Foreign key constraint violation",
          details: "User or product not found",
          code: error.code,
        },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Record not found",
          details: "One of the referenced records does not exist",
          code: error.code,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper function untuk generate order number
function generateOrderNumber(type = "cart") {
  const prefix =
    type === "cart"
      ? "ORD-CART"
      : type === "direct"
        ? "ORD-DIRECT"
        : type === "sample"
          ? "ORD-SAMPLE"
          : "ORD";
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}

// Helper function untuk calculate estimated delivery
function calculateEstimatedDelivery(shippingMethod) {
  if (!shippingMethod || !shippingMethod.estimatedDays) {
    return null;
  }

  const deliveryDate = new Date();

  // Parse estimated days dari string
  if (shippingMethod.estimatedDays.includes("hari ini")) {
    // Same day delivery
    deliveryDate.setDate(deliveryDate.getDate());
  } else if (shippingMethod.estimatedDays.includes("1-2 jam")) {
    // Instant delivery (2 jam dari sekarang)
    deliveryDate.setHours(deliveryDate.getHours() + 2);
  } else {
    // Parse angka dari string seperti "2-3 hari"
    const match = shippingMethod.estimatedDays.match(/(\d+)/);
    if (match) {
      const days = parseInt(match[1]);
      deliveryDate.setDate(deliveryDate.getDate() + days);
    } else {
      // Default: 3 hari
      deliveryDate.setDate(deliveryDate.getDate() + 3);
    }
  }

  return deliveryDate;
}

// Optional: GET endpoint untuk test
export async function GET(request) {
  try {
    const orders = await db.order.findMany({
      take: 10,
      orderBy: { orderDate: "desc" },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
