import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const brands = sqliteTable('brands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
}, (table) => ({
  nameIdx: index('brand_name_idx').on(table.name),
}));

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
}, (table) => ({
  catNameIdx: index('cat_name_idx').on(table.name),
}));

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rawId: text('raw_id').unique(), 
  code: text('code'),
  name: text('name').notNull(),
  nutriscore: text('nutriscore'),
  healthScore: real('health_score'),
  isUltraProcessed: integer('is_ultra_processed', { mode: 'boolean' }),
  imageUrl: text('image_url'),
  
  brandId: integer('brand_id').references(() => brands.id),
  categoryId: integer('category_id').references(() => categories.id),
}, (table) => {
  return {
    nutriIdx: index('nutri_idx').on(table.nutriscore),
    rawIdx: index('raw_id_idx').on(table.rawId),
  };
});

export const nutriments = sqliteTable('nutriments', {
  productId: integer('product_id').primaryKey().references(() => products.id, { onDelete: 'cascade' }),
  calories: real('calories'),
  fat: real('fat'),
  sugars: real('sugars'),
  proteins: real('proteins'),
  salt: real('salt'),
});