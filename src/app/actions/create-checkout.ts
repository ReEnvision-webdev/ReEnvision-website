
"use server"

import Stripe from "stripe"

export async function createCheckoutSession(amount: number, customerName: string) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  })

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to ReEnvision",
              description: "Help us keep education free and accessible for everyone",
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/donation/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/donate`,
      customer_email: undefined, // You can add email field if needed
      metadata: {
        donor_name: customerName,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

