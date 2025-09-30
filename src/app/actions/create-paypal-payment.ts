'use server';

// Fetches a PayPal access token for API requests.
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
  const url =
    environment === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
      : 'https://api-m.paypal.com/v1/oauth2/token';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not set in environment variables');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64'
      )}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error('Failed to get PayPal access token:', errorDetails);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Creates a PayPal payment order and returns the payment details.
export async function createPayPalPayment(
  productName: string,
  amount: string,
  currency: string,
  returnUrl: string,
  cancelUrl: string
) {
  const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
  const baseUrl =
    environment === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

  try {
    const accessToken = await getAccessToken();

    const paymentResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: `Course enrollment: ${productName}`,
            custom_id: productName,
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'ReEnvision',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('PayPal API Error:', paymentData);
      throw new Error('Failed to create payment');
    }

    return paymentData;
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    throw error;
  }
}
