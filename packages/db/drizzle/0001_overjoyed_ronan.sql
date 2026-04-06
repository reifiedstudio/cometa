CREATE TYPE "public"."signature_request_status" AS ENUM('pending', 'partially_signed', 'completed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."signer_status" AS ENUM('pending', 'viewed', 'signed', 'declined', 'expired');--> statement-breakpoint
ALTER TYPE "public"."document_status" ADD VALUE 'rejected' BEFORE 'overdue';--> statement-breakpoint
CREATE TABLE "signature_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"status" "signature_request_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"requested_by" text NOT NULL,
	"requested_by_email" text NOT NULL,
	"document_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signers" (
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
);
--> statement-breakpoint
ALTER TABLE "signature_requests" ADD CONSTRAINT "signature_requests_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signers" ADD CONSTRAINT "signers_request_id_signature_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."signature_requests"("id") ON DELETE no action ON UPDATE no action;