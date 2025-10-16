import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) return new Response("Invalid request", { status: 400 });

  switch (event.type) {
    case "user.created":
    // Handle both OAuth and email/password sign-ups
    case "user.updated": {
      const primaryEmail = event.data.email_addresses.find(
        (email: any) => email.id === event.data.primary_email_address_id
      )?.email_address;

      if (!primaryEmail) {
        console.warn("No primary email found for user:", event.data.id);
        break;
      }

      // Check if user exists in Convex
      const existingUser = await ctx.runMutation(internal.users.getUserByClerkId, {
        clerkId: event.data.id,
      });

      if (!existingUser) {
        // Create new user if they don't exist
        await ctx.runMutation(internal.users.createUser, {
          clerkId: event.data.id,
          email: primaryEmail,
          imageUrl: event.data.image_url,
          name: event.data.username || "Anonymous",
        });
      } else {
        // Update existing user
        await ctx.runMutation(internal.users.updateUser, {
          clerkId: event.data.id,
          email: primaryEmail,
          imageUrl: event.data.image_url,
        });
      }
      break;
    }
    case "user.deleted":
      await ctx.runMutation(internal.users.deleteUser, {
        clerkId: event.data.id!,
      });
      break;
  }
  return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as unknown as WebhookEvent;
};

export default http;
