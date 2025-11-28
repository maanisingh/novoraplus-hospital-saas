// Razorpay integration for Hospital SaaS
// Documentation: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
    backdropclose?: boolean;
    confirm_close?: boolean;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
  on(event: string, handler: (data: unknown) => void): void;
}

export interface PaymentDetails {
  amount: number; // Amount in INR
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  billNumber: string;
  description?: string;
  notes?: Record<string, string>;
}

// Default Razorpay configuration
const RAZORPAY_CONFIG = {
  // Test key - Replace with live key in production
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  currency: 'INR',
  name: 'Hospital SaaS',
  description: 'Hospital Bill Payment',
  image: '/logo.png',
  theme: {
    color: '#3B82F6', // Blue theme to match the app
  },
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  details: PaymentDetails,
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: string) => void
): Promise<void> => {
  // Load script if not already loaded
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure('Failed to load payment gateway. Please try again.');
    return;
  }

  const options: RazorpayOptions = {
    key: RAZORPAY_CONFIG.key,
    amount: Math.round(details.amount * 100), // Convert to paise
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: details.description || `Bill: ${details.billNumber}`,
    image: RAZORPAY_CONFIG.image,
    handler: (response) => {
      onSuccess(response);
    },
    prefill: {
      name: details.patientName,
      email: details.patientEmail,
      contact: details.patientPhone,
    },
    notes: {
      bill_number: details.billNumber,
      ...details.notes,
    },
    theme: RAZORPAY_CONFIG.theme,
    modal: {
      ondismiss: () => {
        onFailure('Payment cancelled by user');
      },
      escape: true,
      animation: true,
      backdropclose: false,
      confirm_close: true,
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', (response: unknown) => {
      const errorResponse = response as { error?: { description?: string } };
      onFailure(errorResponse?.error?.description || 'Payment failed. Please try again.');
    });
    razorpay.open();
  } catch (error) {
    onFailure('Failed to initialize payment. Please try again.');
  }
};

// Verify payment signature (should be done on backend in production)
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  // In production, this should be done on the backend
  // using crypto.createHmac with your Razorpay secret key
  console.log('Payment verification should be done on backend:', {
    orderId,
    paymentId,
    signature,
  });
  return true;
};
