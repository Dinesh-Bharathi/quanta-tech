import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object)
        break
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionCreated(subscription) {
  // Update organization subscription status
  console.log("Subscription created:", subscription.id)
}

async function handleSubscriptionUpdated(subscription) {
  // Update organization subscription details
  console.log("Subscription updated:", subscription.id)
}

async function handleSubscriptionDeleted(subscription) {
  // Handle subscription cancellation
  console.log("Subscription deleted:", subscription.id)
}

async function handlePaymentSucceeded(invoice) {
  // Record successful payment
  console.log("Payment succeeded:", invoice.id)
}

async function handlePaymentFailed(invoice) {
  // Handle failed payment
  console.log("Payment failed:", invoice.id)
}
