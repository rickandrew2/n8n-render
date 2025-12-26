import { NextRequest, NextResponse } from "next/server";
import { validateContactForm, formatContactPayload } from "@/lib/utils";
import type { ContactFormData } from "@/lib/utils";

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error messages for API responses
const API_ERROR_MESSAGES = {
  INVALID_BODY: "Invalid request body",
  VALIDATION_FAILED: "Validation failed",
  INTERNAL_ERROR: "Internal server error",
  METHOD_NOT_ALLOWED: "Method not allowed",
  SUCCESS: "Form submitted successfully",
} as const;

/**
 * Contact API Route Handler
 * Receives form submissions and prepares data for automation workflow
 *
 * Automation Integration Flow:
 * 1. This endpoint receives POST requests from the contact form
 * 2. Validates incoming data (name, email, message)
 * 3. Formats payload with metadata (source, timestamp)
 * 4. In production, this would forward to n8n webhook:
 *    - POST to N8N_WEBHOOK_URL environment variable
 *    - n8n workflow processes the inquiry
 *    - AI response generation triggered (e.g., via OpenAI API)
 *    - Automated email reply sent to user
 *    - Notification sent to team
 *
 * Current implementation logs the submission and returns success.
 * To enable n8n integration, uncomment the webhook forwarding code below
 * and set N8N_WEBHOOK_URL in your environment variables.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: API_ERROR_MESSAGES.INVALID_BODY },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const formData: ContactFormData = {
      name: body.name || "",
      email: body.email || "",
      message: body.message || "",
    };

    // Server-side validation
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: API_ERROR_MESSAGES.VALIDATION_FAILED,
          errors: validation.errors,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Format payload with metadata for automation tracking
    // This structure is designed for easy consumption by n8n webhooks
    const payload = formatContactPayload(formData);

    // Log submission for debugging (remove in production or use proper logging service)
    console.log("Contact form submission received:", {
      email: payload.email,
      timestamp: payload.timestamp,
      source: payload.source,
    });

    // TODO: n8n Webhook Integration
    // Uncomment the following code to forward submissions to n8n:
    /*
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!webhookResponse.ok) {
          console.error("n8n webhook failed:", await webhookResponse.text());
          // Still return success to user, but log the error
        }
      } catch (webhookError) {
        console.error("Error calling n8n webhook:", webhookError);
        // Log error but don't fail the request
      }
    }
    */

    // AI Response Generation Point:
    // After n8n receives the webhook, the workflow would:
    // 1. Extract inquiry details (email, message)
    // 2. Call AI service (OpenAI, Anthropic, etc.) to generate personalized response
    // 3. Send automated email reply to user
    // 4. Create ticket/notification for team follow-up
    // 5. Store inquiry in CRM/database for tracking

    return NextResponse.json(
      {
        message: API_ERROR_MESSAGES.SUCCESS,
        data: {
          // Don't expose full payload in response for security
          timestamp: payload.timestamp,
        },
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        message: API_ERROR_MESSAGES.INTERNAL_ERROR,
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: API_ERROR_MESSAGES.METHOD_NOT_ALLOWED },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  );
}

