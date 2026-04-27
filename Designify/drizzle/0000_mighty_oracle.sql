CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" text NOT NULL,
	"product_id" integer NOT NULL,
	"design_url" text,
	"quantity" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" jsonb,
	"has_front_and_back" boolean DEFAULT false,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"zip" text NOT NULL,
	"address" text NOT NULL,
	"total_amount" integer NOT NULL,
	"payment_id" text,
	"payment_method" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"long_description" text,
	"pricing" integer NOT NULL,
	"is_featured" boolean DEFAULT false,
	"is_popular" boolean DEFAULT false,
	"category_name" text NOT NULL,
	"product_image" jsonb NOT NULL,
	"document_id" text NOT NULL,
	"sizes" jsonb,
	"mockup_2d_front" text,
	"mockup_2d_back" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"picture" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
