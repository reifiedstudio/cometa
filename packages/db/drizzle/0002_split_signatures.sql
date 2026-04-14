-- Create signatures schema
CREATE SCHEMA IF NOT EXISTS "signatures";--> statement-breakpoint

-- Add signature_request_id to documents (missing column)
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "signature_request_id" text;--> statement-breakpoint

-- Create signature tables in signatures schema
CREATE TABLE "signatures"."signature_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_ref" text,
	"status" "signature_request_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"requested_by" text NOT NULL,
	"requested_by_email" text NOT NULL,
	"document_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "signatures"."signers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "signers_token_unique" UNIQUE("token")
);--> statement-breakpoint

CREATE TABLE "signatures"."signature_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"s3_key" text NOT NULL,
	"s3_bucket" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

-- Add foreign keys for new signature tables
ALTER TABLE "signatures"."signers" ADD CONSTRAINT "signers_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "signatures"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signatures"."signature_files" ADD CONSTRAINT "signature_files_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "signatures"."signature_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Migrate existing data from public.signature_requests to signatures.signature_requests
INSERT INTO "signatures"."signature_requests" ("id", "source_ref", "status", "message", "requested_by", "requested_by_email", "document_hash", "expires_at", "created_at", "updated_at")
SELECT "id", "document_id"::text, "status", "message", "requested_by", "requested_by_email", "document_hash", "expires_at", "created_at", "updated_at"
FROM "public"."signature_requests";--> statement-breakpoint

-- Migrate existing signers (request IDs preserved)
INSERT INTO "signatures"."signers" ("id", "request_id", "email", "name", "token", "otp_code", "otp_expires_at", "status", "order", "signed_at", "ip_address", "user_agent", "created_at", "updated_at")
SELECT "id", "request_id", "email", "name", "token", "otp_code", "otp_expires_at", "status", "order", "signed_at", "ip_address", "user_agent", "created_at", "updated_at"
FROM "public"."signers";--> statement-breakpoint

-- Backfill signature_request_id on documents
UPDATE "documents" d SET "signature_request_id" = sr."id"::text
FROM "signatures"."signature_requests" sr
WHERE sr."source_ref" = d."id"::text;--> statement-breakpoint

-- Drop old public tables (signers first due to FK)
DROP TABLE "public"."signers";--> statement-breakpoint
DROP TABLE "public"."signature_requests";
