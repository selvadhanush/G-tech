const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database with e-commerce defaults...');

  // 1. Seed Admin User
  const adminEmail = 'reach2gtech@gmail.com';
  const adminPassword = 'gtech_admin_2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: 'GTECH_ADMIN'
    },
    create: {
      name: 'G-TECH Admin',
      email: adminEmail,
      phone: '9363706040',
      passwordHash,
      role: 'GTECH_ADMIN',
      isActive: true
    },
  });
  console.log(`Admin user upserted: ${admin.name} (${admin.email})`);

  // 2. Seed Customer User (for testing)
  const customerEmail = 'customer@gtech.com';
  const customerPassword = 'gtech_customer_2026';
  const customerPasswordHash = await bcrypt.hash(customerPassword, 10);
  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: { passwordHash: customerPasswordHash },
    create: {
      name: 'Test Customer',
      email: customerEmail,
      phone: '9988776655',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      isActive: true
    }
  });
  console.log(`Customer user upserted: ${customer.name} (${customer.email})`);

  // 3. Seed Categories
  const categoriesData = [
    { name: 'Laptop', slug: 'laptop' },
    { name: 'Desktop', slug: 'desktop' },
    { name: 'Networking Equipment', slug: 'networking' },
    { name: 'CCTV Cameras', slug: 'cctv' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  await prisma.category.deleteMany();
  
  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }
  console.log('Categories seeded.');

  // 4. Seed Products
  const productsData = [
    {
      name: 'Dell Latitude 3440 Business Laptop',
      slug: 'dell-latitude-3440',
      description: 'Intel Core i5 12th Gen, 16GB DDR4 RAM, 512GB PCIe NVMe SSD, 14-inch Full HD display, Windows 11 Pro.',
      price: 58000,
      discountPrice: 54999,
      stock: 15,
      sku: 'GTECH-LAP-001',
      brand: 'Dell',
      imageUrls: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800'],
      isFeatured: true,
      categoryId: categories['laptop']
    },
    {
      name: 'Lenovo ThinkPad E14 Gen 5',
      slug: 'lenovo-thinkpad-e14',
      description: 'AMD Ryzen 5 7530U processor, 8GB DDR4 RAM (expandable), 512GB SSD, 14-inch IPS display, Fingerprint reader.',
      price: 49000,
      discountPrice: 46500,
      stock: 10,
      sku: 'GTECH-LAP-002',
      brand: 'Lenovo',
      imageUrls: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800'],
      isFeatured: false,
      categoryId: categories['laptop']
    },
    {
      name: 'High-Performance 4K Video Editing PC',
      slug: 'high-performance-4k-editing-pc',
      description: 'Custom assembled workstation. Intel Core i7-14700K, 32GB DDR5 Corsair Vengeance RAM, NVIDIA RTX 4070 12GB GPU, 1TB NVMe Gen4 SSD, 750W 80+ Gold PSU.',
      price: 135000,
      discountPrice: 128000,
      stock: 5,
      sku: 'GTECH-DESK-001',
      brand: 'G-TECH Custom',
      imageUrls: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800'],
      isFeatured: true,
      categoryId: categories['desktop']
    },
    {
      name: 'G-TECH Office Workstation PC',
      slug: 'gtech-office-workstation-pc',
      description: 'Intel Core i3 12th Gen, 8GB DDR4 RAM, 256GB SSD + 1TB HDD, Intel UHD Graphics, premium micro-ATX cabinet, keyboard & mouse combo.',
      price: 26000,
      discountPrice: 24000,
      stock: 20,
      sku: 'GTECH-DESK-002',
      brand: 'G-TECH Custom',
      imageUrls: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'],
      isFeatured: false,
      categoryId: categories['desktop']
    },
    {
      name: 'TP-Link JetStream 24-Port Gigabit Switch',
      slug: 'tp-link-24-port-switch',
      description: '24-Port Gigabit Smart Switch with 4 SFP Slots, L2/L3 static routing, secure enterprise features, rack-mountable.',
      price: 12000,
      discountPrice: 10800,
      stock: 8,
      sku: 'GTECH-NET-001',
      brand: 'TP-Link',
      imageUrls: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800'],
      isFeatured: true,
      categoryId: categories['networking']
    },
    {
      name: 'Ubiquiti UniFi U6-Lite Access Point',
      slug: 'unifi-u6-lite-ap',
      description: 'Wi-Fi 6 Access Point with dual-band support, 1.5 Gbps aggregate throughput, PoE powered (injector sold separately).',
      price: 14500,
      discountPrice: 13999,
      stock: 12,
      sku: 'GTECH-NET-002',
      brand: 'Ubiquiti',
      imageUrls: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800'],
      isFeatured: false,
      categoryId: categories['networking']
    },
    {
      name: 'CP PLUS 4MP Dome Network IP Camera',
      slug: 'cp-plus-4mp-dome-ip-camera',
      description: '4 Megapixel resolution, H.265+ compression, 30m Smart IR range, IP67 weatherproof rating, PoE enabled, built-in mic.',
      price: 4500,
      discountPrice: 3800,
      stock: 50,
      sku: 'GTECH-CCTV-001',
      brand: 'CP PLUS',
      imageUrls: ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800'],
      isFeatured: true,
      categoryId: categories['cctv']
    },
    {
      name: 'Logitech MK220 Wireless Keyboard & Mouse',
      slug: 'logitech-mk220-wireless-combo',
      description: 'Compact space-saving layout, 2.4GHz wireless connectivity with 10m range, long-lasting battery life.',
      price: 1500,
      discountPrice: 1349,
      stock: 40,
      sku: 'GTECH-ACC-001',
      brand: 'Logitech',
      imageUrls: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800'],
      isFeatured: false,
      categoryId: categories['accessories']
    }
  ];

  await prisma.product.deleteMany();
  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log('Products seeded successfully.');
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
