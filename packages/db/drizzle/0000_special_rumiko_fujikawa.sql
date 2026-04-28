CREATE SCHEMA "signatures";
--> statement-breakpoint
CREATE TYPE "public"."document_source" AS ENUM('upload', 'email');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('processing', 'pending', 'reviewed', 'approved', 'rejected', 'overdue', 'awaiting_signature');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('invoice', 'receipt', 'contract', 'delivery_note', 'bill');--> statement-breakpoint
CREATE TYPE "public"."signature_request_status" AS ENUM('pending', 'partially_signed', 'completed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."signer_status" AS ENUM('pending', 'viewed', 'signed', 'declined', 'expired');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" text NOT NULL,
	"action" varchar(64) NOT NULL,
	"detail" text,
	"previous_value" text,
	"new_value" text,
	"user_id" text,
	"user_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"plural_name" varchar(128) NOT NULL,
	"badge_color" varchar(64) DEFAULT 'bg-gray-100 text-gray-700' NOT NULL,
	"description" text,
	"fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "document_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"file_hash" text NOT NULL,
	"s3_url" text NOT NULL,
	"s3_key" text NOT NULL,
	"thumbnail_url" text,
	"thumbnail_key" text,
	"type" text,
	"status" "document_status" DEFAULT 'processing' NOT NULL,
	"source" "document_source" DEFAULT 'upload' NOT NULL,
	"description" text,
	"ai_summary" text,
	"extracted_data" jsonb,
	"ocr_text" text,
	"textract_response" jsonb,
	"is_duplicate" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"flags" jsonb DEFAULT '[]'::jsonb,
	"type_version" integer,
	"rejection_reason" text,
	"sender_email" text,
	"signature_request_id" text,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signatures"."signature_files" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"s3_key" text NOT NULL,
	"s3_bucket" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signatures"."signature_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"source_ref" text,
	"status" "signature_request_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"requested_by" text NOT NULL,
	"requested_by_email" text NOT NULL,
	"document_hash" text NOT NULL,
	"certificate_key" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signatures"."signers" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"token" varchar(64) NOT NULL,
	"otp_code" varchar(6),
	"otp_expires_at" timestamp,
	"status" "signer_status" DEFAULT 'pending' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"signed_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"signature_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "signers_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures"."signature_files" ADD CONSTRAINT "signature_files_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "signatures"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures"."signers" ADD CONSTRAINT "signers_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "signatures"."signature_requests"("id") ON DELETE no action ON UPDATE no action;