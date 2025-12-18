import { verifyJWT } from "@/lib/utils";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const token = request?.cookies?.get("customer_jwt_token")?.value;
    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const customerData = await db.User.findUnique({
      where: {
        email: decodedToken.email,
      },
    });

    return NextResponse.json({
      message: "Customer's data fetch succesfully",
      data: customerData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        Message: "something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
