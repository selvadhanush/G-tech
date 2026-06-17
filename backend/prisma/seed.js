const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin User
  const adminEmail = 'reach2gtech@gmail.com';
  const adminUsername = 'admin';
  const adminPassword = 'gtech_admin_2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user upserted: ${admin.username} (${admin.email})`);
  console.log(`Default admin credentials: Username: admin, Password: ${adminPassword}`);

  // 2. Seed Services
  const defaultServices = [
    {
      title: 'Laptop Services',
      description: 'Professional laptop repair, hardware upgrades (RAM/SSD), OS installation, virus removal, keyboard & screen replacements for all major brands.',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Desktop Services',
      description: 'Custom desktop building for gaming, office, & editing. Hardware troubleshooting, motherboard repairs, thermal paste replacement, and regular maintenance.',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Networking Solutions',
      description: 'End-to-end office networking setup, router/switch configurations, structured cabling, secure WiFi installation, and VPN configurations.',
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'CCTV Installation & Maintenance',
      description: 'High-definition analog and IP security camera installation. Remote mobile viewing configuration, DVR/NVR setups, and annual maintenance contracts (AMC).',
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    },
  ];

  // We can delete existing services to seed clean or just check
  // For a clean seed, let's delete existing ones or upsert them. We'll do a simple deleteMany and createMany
  await prisma.service.deleteMany({});
  for (const service of defaultServices) {
    await prisma.service.create({ data: service });
  }
  console.log('Services seeded successfully.');

  // 3. Seed Projects
  const defaultProjects = [
    {
      title: 'Office Network Infrastructure Setup',
      description: 'Complete Cat6 cabling, rack setup, and managed switch configuration for a 50-node IT company office in T-Nagar.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      category: 'Networking',
      location: 'T-Nagar, Chennai',
      completedDate: '2026-04-10',
    },
    {
      title: 'Commercial Showroom CCTV Surveillance',
      description: 'Installation of 16 Hikvision IP cameras with remote mobile app access and 30-day backup storage setup.',
      imageUrl: 'https://images.unsplash.com/photo-1524413840003-05174b1e7d73?auto=format&fit=crop&q=80&w=800',
      category: 'CCTV',
      location: 'Richie Street, Chennai',
      completedDate: '2026-05-18',
    },
    {
      title: 'Gaming Desktop Builds for Editing Studio',
      description: 'Custom configured 5 high-end desktops utilizing Intel i9 processors and RTX 4070 graphic cards for 4K video editing workflows.',
      imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
      category: 'Desktop',
      location: 'Adyar, Chennai',
      completedDate: '2026-06-01',
    },
    {
      title: 'Bulk Corporate Laptop Servicing & Upgrades',
      description: 'Completed annual health check, RAM & SSD upgrades for 35 corporate laptops to optimize startup speed and workflows.',
      imageUrl: 'https://images.unsplash.com/photo-1597872200319-382d76141664?auto=format&fit=crop&q=80&w=800',
      category: 'Laptop',
      location: 'Velachery, Chennai',
      completedDate: '2026-06-12',
    },
  ];

  await prisma.project.deleteMany({});
  for (const project of defaultProjects) {
    await prisma.project.create({ data: project });
  }
  console.log('Projects seeded successfully.');

  // 4. Seed Testimonials
  const defaultTestimonials = [
    {
      customerName: 'Rajesh Kumar (Adithya Builders)',
      rating: 5,
      review: 'G-TECH Innovation did a fantastic job with our new office network installation. Professional team, prompt response, and absolute value for money.',
    },
    {
      customerName: 'Priya Sundar',
      rating: 5,
      review: 'My Dell laptop had a motherboard issue and black screen. The service technicians at Richie Street Vijaya Lakshmi Complex diagnosed and fixed it within 24 hours. Highly recommended!',
    },
    {
      customerName: 'Manoj Selvam',
      rating: 4,
      review: 'Got 8 CCTV cameras installed for my apartment complex. The wiring is very neat, and the mobile application viewing works seamlessly. Good explanation on how to operate it.',
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const testimonial of defaultTestimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log('Testimonials seeded successfully.');

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
