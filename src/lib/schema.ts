import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rawId: text('raw_id').notNull(),
  name: text('name').notNull(),
  brand: text('brand'),
  nutriscore: text('nutriscore'),
  category: text('category'),
  healthScore: real('health_score'),
  isUltraProcessed: integer('is_ultra_processed', { mode: 'boolean' }),
  imageUrl: text('image_url'),
}, (table) => {
  return {
    brandIdx: index('brand_idx').on(table.brand),
    catIdx: index('cat_idx').on(table.category),
    nutriIdx: index('nutri_idx').on(table.nutriscore),
  };
});