import { NextRequest, NextResponse } from 'next/server';
import { dbSql } from '@/lib/sqlite';
import { products, brands, categories } from '@/lib/schema';
import { eq, like, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, parseInt(searchParams.get('pageSize') || '20'));
    const offset = (page - 1) * pageSize;

    const nutriscore = searchParams.get('nutriscore');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const filters = [];
    if (nutriscore) filters.push(eq(products.nutriscore, nutriscore.toUpperCase()));
    if (brand) filters.push(like(brands.name, `%${brand}%`)); 
    if (category) filters.push(eq(categories.name, category)); 
    if (search) filters.push(like(products.name, `%${search}%`));

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const data = await dbSql
    .select({
      id: products.id,
      name: products.name,
      nutriscore: products.nutriscore,
      healthScore: products.healthScore,
      isUltraProcessed: products.isUltraProcessed,
      imageUrl: products.imageUrl,         
      brand: brands.name,                  
      category: categories.name 
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .limit(pageSize)
    .offset(offset);

    const totalResult = await dbSql
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause);
    
    const total = totalResult[0].count;

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("Erreur API Liste:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}