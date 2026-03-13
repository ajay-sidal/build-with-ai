# Database Optimization Guide

## Indexes Added

The following indexes have been added to optimize query performance:

### Account Model
- `userId` - Fast lookup of accounts by user
- `provider, providerAccountId` - Unique constraint (already existed)

### Session Model
- `userId` - Fast lookup of sessions by user
- `sessionToken` - Fast session validation

### User Model
- `email` - Fast user lookup by email (login)
- `role` - Fast filtering by user role (admin checks)

### Order Model
- `userId` - Fast lookup of orders by customer
- `stripeId` - Fast Stripe webhook processing
- `createdAt` - Fast date-based queries and sorting
- `shippingStatus` - Fast filtering for fulfillment
- `returnStatus` - Fast filtering for returns processing

### OrderItem Model
- `orderId` - Fast lookup of order items

## Migration Required

After these changes, run:

```bash
npx prisma migrate dev --name add_performance_indexes
```

## Query Optimization Tips

1. **Use select**: Only fetch needed fields
   ```typescript
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, email: true, role: true }
   })
   ```

2. **Use pagination**: Limit result sets
   ```typescript
   const orders = await prisma.order.findMany({
     where: { userId },
     take: 10,
     skip: 0,
     orderBy: { createdAt: 'desc' }
   })
   ```

3. **Use include wisely**: Only include relations when needed
   ```typescript
   const order = await prisma.order.findUnique({
     where: { id },
     include: { items: true } // Only if you need items
   })
   ```

4. **Use transactions**: For multiple related operations
   ```typescript
   await prisma.$transaction(async (tx) => {
     await tx.order.create({ ... })
     await tx.orderItem.createMany({ ... })
   })
   ```

## Monitoring

Use Prisma's built-in query logging in development:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

For production, consider using APM tools like Datadog or New Relic.
