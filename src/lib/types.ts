export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Product = {
  id: string;
  slug: string;
  name: string;
  headline: string | null;
  headline_em: string | null;
  description: string | null;
  price: number;
  old_price: number | null;
  currency: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Spec = {
  id: string;
  product_id: string;
  value: string;
  label: string;
  sort_order: number;
};

export type Dimension = {
  id: string;
  product_id: string;
  name: string;
  value: string;
  unit: string | null;
  sort_order: number;
};

export type Feature = {
  id: string;
  product_id: string;
  icon: string;
  title: string;
  text: string;
  sort_order: number;
};

export type Use = {
  id: string;
  product_id: string;
  emoji: string;
  title: string;
  text: string;
  sort_order: number;
};

export type Benefit = {
  id: string;
  product_id: string;
  icon: string;
  text: string;
  sort_order: number;
};

export type Color = {
  id: string;
  product_id: string;
  value: string;
  swatch: string;
  sort_order: number;
};

export type SiteSettings = {
  [key: string]: Json;
};

export type AnalyticsEvent = {
  id: number;
  event: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id">;
        Update: Partial<Omit<ProductImage, "id">>;
        Relationships: [];
      };
      specs: {
        Row: Spec;
        Insert: Omit<Spec, "id">;
        Update: Partial<Omit<Spec, "id">>;
        Relationships: [];
      };
      dimensions: {
        Row: Dimension;
        Insert: Omit<Dimension, "id">;
        Update: Partial<Omit<Dimension, "id">>;
        Relationships: [];
      };
      features: {
        Row: Feature;
        Insert: Omit<Feature, "id">;
        Update: Partial<Omit<Feature, "id">>;
        Relationships: [];
      };
      uses: {
        Row: Use;
        Insert: Omit<Use, "id">;
        Update: Partial<Omit<Use, "id">>;
        Relationships: [];
      };
      benefits: {
        Row: Benefit;
        Insert: Omit<Benefit, "id">;
        Update: Partial<Omit<Benefit, "id">>;
        Relationships: [];
      };
      colors: {
        Row: Color;
        Insert: Omit<Color, "id">;
        Update: Partial<Omit<Color, "id">>;
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: Json };
        Insert: { key: string; value: Json };
        Update: Partial<{ key: string; value: Json }>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<{ user_id: string; created_at: string }>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: { event: string };
        Update: Partial<{ event: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
