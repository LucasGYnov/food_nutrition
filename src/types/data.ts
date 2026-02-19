export interface RawDocument {
  source: string;
  fetched_at: string;
  raw_hash: string;
  payload: any;
}

export interface EnrichedProduct {
  raw_id: string;
  product_name: string;
  brand: string;
  nutriscore: string;
  category_label: string;
  internal_health_score: number;
  is_ultra_processed: boolean;
  image_url: string;
  processed_at: string;
}