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

export type AnalyticsCounter = {
  event: string;
  count: number;
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
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      specs: {
        Row: Spec;
        Insert: Omit<Spec, "id">;
        Update: Partial<Omit<Spec, "id">>;
        Relationships: [
          {
            foreignKeyName: "specs_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      dimensions: {
        Row: Dimension;
        Insert: Omit<Dimension, "id">;
        Update: Partial<Omit<Dimension, "id">>;
        Relationships: [
          {
            foreignKeyName: "dimensions_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      features: {
        Row: Feature;
        Insert: Omit<Feature, "id">;
        Update: Partial<Omit<Feature, "id">>;
        Relationships: [
          {
            foreignKeyName: "features_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      uses: {
        Row: Use;
        Insert: Omit<Use, "id">;
        Update: Partial<Omit<Use, "id">>;
        Relationships: [
          {
            foreignKeyName: "uses_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      benefits: {
        Row: Benefit;
        Insert: Omit<Benefit, "id">;
        Update: Partial<Omit<Benefit, "id">>;
        Relationships: [
          {
            foreignKeyName: "benefits_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      colors: {
        Row: Color;
        Insert: Omit<Color, "id">;
        Update: Partial<Omit<Color, "id">>;
        Relationships: [
          {
            foreignKeyName: "colors_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
      analytics_counters: {
        Row: AnalyticsCounter;
        Insert: { event: string; count?: number };
        Update: Partial<{ event: string; count: number }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_event: {
        Args: { p_event: string };
        Returns: undefined;
      };
      replace_product_rows: {
        Args: { p_table: string; p_product_id: string; p_rows: Json };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
  };
};
