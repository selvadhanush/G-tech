const prisma = require('./src/config/prisma');

async function testQuery() {
  try {
    console.log('Fetching users first...');
    const users = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      }
    });
    console.log(`Found ${users.length} CUSTOMER users.`);

    for (const user of users) {
      console.log(`\nFetching orders for user: ${user.name} (${user.id})`);
      const orders = await prisma.order.findMany({
        where: { customerId: user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrls: true,
                  brand: true
                }
              }
            }
          },
          address: true,
          payment: true
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log(`Orders count for ${user.name}: ${orders.length}`);
      console.log(JSON.stringify(orders, null, 2));
    }
  } catch (err) {
    console.error('Prisma query failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
