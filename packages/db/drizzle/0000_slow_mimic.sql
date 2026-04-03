CREATE TYPE "public"."document_source" AS ENUM('upload', 'email');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('processing', 'pending', 'reviewed', 'approved', 'overdue', 'awaiting_signature');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('invoice', 'receipt', 'contract', 'delivery_note', 'bill');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"file_hash" text NOT NULL,
	"s3_url" text NOT NULL,
	"s3_key" text NOT NULL,
	"thumbnail_url" text,
	"thumbnail_key" text,
	"type" "document_type",
	"status" "document_status" DEFAULT 'processing' NOT NULL,
	"source" "document_source" DEFAULT 'upload' NOT NULL,
	"description" text,
	"ai_summary" text,
	"extracted_data" jsonb,
	"ocr_text" text,
	"textract_response" jsonb,
	"is_duplicate" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"flags" jsonb DEFAULT '[]'::jsonb,
	"sender_email" text,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
