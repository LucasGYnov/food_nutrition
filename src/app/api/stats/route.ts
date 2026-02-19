import { NextResponse } from 'next/server';
import { dbSql } from '@/lib/sqlite';
import { products, categories } from '@/lib/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET() {
  const stats = await dbSql.select({
    total: sql<number>`count(*)`,
    avgHealthScore: sql<number>`avg(${products.healthScore})`, 
    ultraProcessedCount: sql<number>`sum(case when ${products.isUltraProcessed} = 1 then 1 else 0 end)`,
  }).from(products);

  const topCategories = await dbSql.select({
    name: categories.name,
    count: sql<number>`count(*)`,
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .groupBy(categories.name)
  .limit(5);

  return NextResponse.json({
    global: stats[0],
    topCategories: topCategories
  });
}