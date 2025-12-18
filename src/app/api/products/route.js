import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const getArray = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const search = searchParams.get("search")?.toLowerCase();

  const filters = {
    productTypeIds: getArray("productTypeId").map(Number),
    weights: getArray("weight"),
    widths: getArray("width"),
    yarnNumbers: getArray("yarnNumber"),
    technics: getArray("technics"),
    styles: getArray("style"),
    patterns: getArray("pattern"),
  };

  const isFiltering =
    filters.productTypeIds.length ||
    filters.weights.length ||
    filters.widths.length ||
    filters.yarnNumbers.length ||
    filters.technics.length ||
    filters.styles.length ||
    filters.patterns.length ||
    !!search;

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(search && {
          name: {
            contains: search.toLowerCase(),
          },
        }),
        ...(isFiltering && {
          ...(filters.productTypeIds.length && {
            productTypeId: { in: filters.productTypeIds },
          }),
          ...(filters.weights.length && {
            weight: { in: filters.weights },
          }),
          ...(filters.widths.length && {
            width: { in: filters.widths },
          }),
          ...(filters.yarnNumbers.length && {
            yarnNumber: { in: filters.yarnNumbers },
          }),
          ...(filters.technics.length && {
            technics: {
              some: { name: { in: filters.technics } },
            },
          }),
          ...(filters.styles.length && {
            styles: {
              some: { name: { in: filters.styles } },
            },
          }),
          ...(filters.patterns.length && {
            patterns: {
              some: { name: { in: filters.patterns } },
            },
          }),
        }),
      },
      include: {
        productType: true,
        technics: true,
        styles: true,
        patterns: true,
      },
    });

    return NextResponse.json({
      status: 200,
      message: isFiltering
        ? "Filtered products fetched successfully!"
        : "All products fetched successfully!",
      data: products,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Something Went Wrong.", detail: error.message },
      { status: 500 }
    );
  }
}
