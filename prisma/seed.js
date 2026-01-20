// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. AdminUser
  const adminUser = await prisma.adminUser.create({
    data: {
      userType: "Super Admin",
      userName: "admin",
      password: "$2b$05$i6M.rSR4t/r5JoxF46ZA0.Sr2g4Sg7GQ391BlEtER9Je0N17c6NhS", // admin123
    },
  });

  // 2. User
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "$2b$05$i6M.rSR4t/r5JoxF46ZA0.Sr2g4Sg7GQ391BlEtER9Je0N17c6NhS", // user123
      phone_number: "+6281234567890",
      tax_number: "123-456-789",
      billingAddresses: {
        create: [
          {
            label: "Rumah",
            address_line: "Jl. Merdeka No. 123",
            city: "Jakarta",
            postal_code: "10110",
            is_default: true,
          },
          {
            label: "Kantor",
            address_line: "Jl. Sudirman No. 456",
            city: "Jakarta",
            postal_code: "10220",
            is_default: false,
          },
        ],
      },
      shippingAddresses: {
        create: [
          {
            label: "Alamat Pengiriman Utama",
            address_line: "Jl. Gatot Subroto No. 789",
            city: "Jakarta",
            postal_code: "10270",
            is_default: true,
          },
        ],
      },
    },
  });

  // 3. ProductType
  const productTypes = await Promise.all([
    prisma.productType.create({
      data: {
        name: "Kain",
        products: {
          create: [],
        },
      },
    }),
    prisma.productType.create({
      data: {
        name: "Benang",
        products: {
          create: [],
        },
      },
    }),
    prisma.productType.create({
      data: {
        name: "Aksesoris",
        products: {
          create: [],
        },
      },
    }),
  ]);

  // 4. Technic
  const technics = await Promise.all([
    prisma.technic.create({ data: { name: "Tenun" } }),
    prisma.technic.create({ data: { name: "Rajut" } }),
    prisma.technic.create({ data: { name: "Sulam" } }),
    prisma.technic.create({ data: { name: "Print" } }),
  ]);

  // 5. Style
  const styles = await Promise.all([
    prisma.style.create({ data: { name: "Modern" } }),
    prisma.style.create({ data: { name: "Tradisional" } }),
    prisma.style.create({ data: { name: "Minimalis" } }),
    prisma.style.create({ data: { name: "Bohemian" } }),
  ]);

  // 6. Pattern
  const patterns = await Promise.all([
    prisma.pattern.create({ data: { name: "Floral" } }),
    prisma.pattern.create({ data: { name: "Geometric" } }),
    prisma.pattern.create({ data: { name: "Stripes" } }),
    prisma.pattern.create({ data: { name: "Polkadot" } }),
  ]);

  // 7. Product dengan semua relasi
  const product1 = await prisma.product.create({
    data: {
      id_barang: "BRG001",
      name: "Kain Katun Premium",
      description: "Kain katun berkualitas tinggi dengan tekstur halus",
      mrp: 150000,
      image: "https://example.com/kain1.jpg",
      productTypeId: productTypes[0].id,
      currentStock: 100,
      material: "100% Katun",
      charateristic: "Breathable, Soft",
      sample_price: '50000',
      moq: '10',
      weight: '200',
      width: '115',
      priceTiers: {
        create: [
          { minQty: 1, maxQty: 10, unitPrice: 140000 },
          { minQty: 11, maxQty: 50, unitPrice: 130000 },
          { minQty: 51, maxQty: null, unitPrice: 120000 },
        ],
      },
      technics: {
        connect: [{ id: technics[0].id }, { id: technics[3].id }],
      },
      styles: {
        connect: [{ id: styles[0].id }, { id: styles[1].id }],
      },
      patterns: {
        connect: [{ id: patterns[0].id }],
      },
      colorStocks: {
        create: [
          { color: "Merah", stock: 30 },
          { color: "Biru", stock: 40 },
          { color: "Hijau", stock: 30 },
        ],
      },
      sample: {
        create: [
          {color_sample: "Merah", stock_sample: 10},
          {color_sample: "Biru", stock_sample: 10},
          {color_sample: "Hijau", stock_sample: 10},
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      id_barang: "BRG002",
      name: "Benang Sutra",
      description: "Benang sutra halus untuk sulaman premium",
      mrp: 75000,
      image: "https://example.com/benang1.jpg",
      productTypeId: productTypes[1].id,
      currentStock: 200,
      material: "100% Sutra",
      charateristic: "Shiny, Strong",
      sample_price: '25000',
      moq: '5',
      weight: '50',
      width: '10',
      priceTiers: {
        create: [
          { minQty: 1, maxQty: 20, unitPrice: 70000 },
          { minQty: 21, maxQty: 100, unitPrice: 65000 },
          { minQty: 101, maxQty: null, unitPrice: 60000 },
        ],
      },
      technics: {
        connect: [{ id: technics[2].id }],
      },
      styles: {
        connect: [{ id: styles[2].id }],
      },
      patterns: {
        connect: [{ id: patterns[1].id }, { id: patterns[2].id }],
      },
      colorStocks: {
        create: [
          { color: "Emas", stock: 50 },
          { color: "Perak", stock: 50 },
          { color: "Putih", stock: 100 },
        ],
      },
      sample: {
        create: [
          {color_sample: "Emas", stock_sample: 10},
          {color_sample: "Perak", stock_sample: 10},
          {color_sample: "Putih", stock_sample: 10},
        ],
      },
    },
  });

  // 8. Cart
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      productId: product1.id,
      quantity: 2,
      priceTotal: 280000,
      color: "Merah",
      status: "active",
    },
  });

  // 9. Negotiation
  const negotiation = await prisma.negotiation.create({
    data: {
      userId: user.id,
      productId: product2.id,
      quantity: 50,
      offeredPrice: 3000000,
      sellerPrice: 3250000,
      finalPrice: 3125000,
      color: "Emas",
      notes: "Butuh untuk proyek besar",
      status: "accepted",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
      respondedAt: new Date(),
    },
  });

  console.log("Seeding completed!");

  // Menampilkan informasi penting
  console.log("\n=== LOGIN INFORMATION ===");
  console.log("ADMIN:");
  console.log("Username: admin");
  console.log("Password: oke12345");
  console.log("\nUSER:");
  console.log("Email: john@example.com");
  console.log("Password: oke12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
