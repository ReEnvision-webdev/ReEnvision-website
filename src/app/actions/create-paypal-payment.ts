"use server"

export async function createPayPalPayment(amount: number, customerName: string) {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID
  const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET
  const paypalEnvironment = process.env.PAYPAL_ENVIRONMENT || "sandbox" // sandbox or live

  if (!paypalClientId || !paypalClientSecret) {
    throw new Error("PayPal credentials are not set in environment variables")
  }

  const baseUrl = paypalEnvironment === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"

  try {
    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Create payment
    const paymentResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: "Donation to ReEnvision - Help us keep education free and accessible for everyone",
            custom_id: customerName,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/donation/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/donate`,
          brand_name: "ReEnvision",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      }),
    })

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json()
      console.error("PayPal API Error:", errorData)
      throw new Error("Failed to create PayPal payment")
    }

    const paymentData = await paymentResponse.json()

    // Find the approval URL
    const approvalUrl = paymentData.links.find((link: any) => link.rel === "approve")?.href

    if (!approvalUrl) {
      throw new Error("No approval URL found in PayPal response")
    }

    return {
      orderId: paymentData.id,
      approvalUrl: approvalUrl,
    }
  } catch (error) {
    console.error("Error creating PayPal payment:", error)
    throw new Error("Failed to create PayPal payment")
  }
}
