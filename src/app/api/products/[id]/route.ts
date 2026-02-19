import { NextRequest, NextResponse } from 'next/server';
import { dbSql } from '@/lib/sqlite';
import { products, brands, categories } from '@/lib/schema'; // Ajout des tables liées
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    console.log("Tentative de récupération SQL pour l'ID :", id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const result = await dbSql.select({
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
      .where(eq(products.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ 
        error: "Produit non trouvé", 
        triedId: id 
      }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Erreur API Detail:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}