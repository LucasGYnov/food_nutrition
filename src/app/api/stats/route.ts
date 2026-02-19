import { NextResponse } from 'next/server';
import { dbSql } from '@/lib/sqlite';
import { products } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  const stats = await dbSql.select({
    total: sql<number>`count(*)`,
    avgHealthScore: sql<number>`avg(health_score)`,
    ultraProcessedCount: sql<number>`sum(case when is_ultra_processed = 1 then 1 else 0 end)`,
  }).from(products);

  const categories = await dbSql.select({
    name: products.category,
    count: sql<number>`count(*)`,
  }).from(products).groupBy(products.category).limit(5);

  return NextResponse.json({
    global: stats[0],
    topCategories: categories
  });
}