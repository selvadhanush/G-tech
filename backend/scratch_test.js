const prisma = require('./src/config/prisma');

async function verifyDbContent() {
  try {
    console.log('--- START DATABASE INTEGRITY CHECK ---');
    
    // 1. Users
    const userCount = await prisma.user.count();
    const sampleUsers = await prisma.user.findMany({ take: 2, select: { id: true, name: true, email: true, role: true } });
    console.log(`\n[User Table] Total records: ${userCount}`);
    console.log('Sample Users:', sampleUsers);

    // 2. Categories
    const categoryCount = await prisma.category.count();
    const sampleCategories = await prisma.category.findMany({ take: 2 });
    console.log(`\n[Category Table] Total records: ${categoryCount}`);
    console.log('Sample Categories:', sampleCategories);

    // 3. Products
    const productCount = await prisma.product.count();
    const sampleProducts = await prisma.product.findMany({ take: 2, select: { id: true, name: true, price: true, sku: true } });
    console.log(`\n[Product Table] Total records: ${productCount}`);
    console.log('Sample Products:', sampleProducts);

    // 4. Contacts / Service Requests
    const contactCount = await prisma.contact.count();
    const sampleContacts = await prisma.contact.findMany({ take: 2 });
    console.log(`\n[Contact Table] Total records: ${contactCount}`);
    console.log('Sample Contacts:', sampleContacts);

    // 5. Testimonials
    const testimonialCount = await prisma.testimonial.count();
    const sampleTestimonials = await prisma.testimonial.findMany({ take: 2 });
    console.log(`\n[Testimonial Table] Total records: ${testimonialCount}`);
    console.log('Sample Testimonials:', sampleTestimonials);

    // 6. Orders
    const orderCount = await prisma.order.count();
    const sampleOrders = await prisma.order.findMany({ take: 2, select: { id: true, totalAmount: true, orderStatus: true } });
    console.log(`\n[Order Table] Total records: ${orderCount}`);
    console.log('Sample Orders:', sampleOrders);

    console.log('\n--- DATABASE INTEGRITY CHECK COMPLETE ---');
  } catch (err) {
    console.error('Database diagnostic failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDbContent();
