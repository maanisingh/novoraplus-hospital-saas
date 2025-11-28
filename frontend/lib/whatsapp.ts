// WhatsApp notification service for Hospital SaaS
// Supports direct WhatsApp links and WhatsApp Business API integration

export interface WhatsAppMessage {
  phone: string; // Phone number with country code (e.g., 919876543210)
  message: string;
}

export interface AppointmentReminder {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  hospitalName: string;
  tokenNumber?: string;
}

export interface BillNotification {
  patientName: string;
  billNumber: string;
  amount: number;
  hospitalName: string;
  paymentLink?: string;
}

export interface LabReportNotification {
  patientName: string;
  testName: string;
  reportStatus: 'ready' | 'pending' | 'completed';
  hospitalName: string;
}

// Format phone number (ensure it has country code)
export const formatPhoneNumber = (phone: string, countryCode: string = '91'): string => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If the number starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // If it doesn't have country code, add it
  if (cleaned.length === 10) {
    cleaned = countryCode + cleaned;
  }

  return cleaned;
};

// Generate WhatsApp web link (opens WhatsApp with pre-filled message)
export const generateWhatsAppLink = (phone: string, message: string): string => {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

// Open WhatsApp in new tab/window
export const openWhatsApp = (phone: string, message: string): void => {
  const link = generateWhatsAppLink(phone, message);
  window.open(link, '_blank');
};

// Message Templates
export const messageTemplates = {
  // Appointment reminder template
  appointmentReminder: (data: AppointmentReminder): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

This is a reminder for your upcoming appointment:

📅 Date: ${data.appointmentDate}
⏰ Time: ${data.appointmentTime}
👨‍⚕️ Doctor: ${data.doctorName}
${data.tokenNumber ? `🎫 Token: ${data.tokenNumber}` : ''}

Please arrive 15 minutes before your scheduled time.

For any queries, please contact our reception.

Thank you for choosing us! 🙏`;
  },

  // Bill notification template
  billNotification: (data: BillNotification): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

Your bill has been generated:

📋 Bill Number: ${data.billNumber}
💰 Amount: ₹${data.amount.toLocaleString()}

${data.paymentLink ? `Pay Online: ${data.paymentLink}` : 'Please visit our billing counter for payment.'}

Thank you for your trust in us! 🙏`;
  },

  // Payment confirmation template
  paymentConfirmation: (data: BillNotification): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

✅ Payment Received!

📋 Bill Number: ${data.billNumber}
💰 Amount Paid: ₹${data.amount.toLocaleString()}

Thank you for your payment! 🙏

Your receipt has been generated. Please collect it from the billing counter.`;
  },

  // Lab report ready template
  labReportReady: (data: LabReportNotification): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

${data.reportStatus === 'ready' ? '✅ Your lab report is ready!' : '⏳ Your lab report is being processed.'}

🧪 Test: ${data.testName}
📊 Status: ${data.reportStatus === 'ready' ? 'Ready for collection' : 'In Progress'}

${data.reportStatus === 'ready' ? 'Please visit our lab to collect your report.' : 'We will notify you when ready.'}

Thank you! 🙏`;
  },

  // OPD Token notification
  opdTokenNotification: (data: {
    patientName: string;
    tokenNumber: string;
    doctorName: string;
    estimatedTime: string;
    hospitalName: string;
  }): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

🎫 Your OPD Token: *${data.tokenNumber}*

👨‍⚕️ Doctor: ${data.doctorName}
⏰ Estimated Time: ${data.estimatedTime}

Please wait in the OPD waiting area. You will be called when your turn arrives.

Thank you for your patience! 🙏`;
  },

  // IPD Admission notification
  ipdAdmissionNotification: (data: {
    patientName: string;
    wardName: string;
    bedNumber: string;
    admissionDate: string;
    doctorName: string;
    hospitalName: string;
  }): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

🏨 IPD Admission Confirmed

🛏️ Ward: ${data.wardName}
🔢 Bed Number: ${data.bedNumber}
📅 Admission Date: ${data.admissionDate}
👨‍⚕️ Attending Doctor: ${data.doctorName}

Please bring all your medical records and necessary items.

For any assistance, contact our IPD nursing station.

Wishing you a speedy recovery! 🙏`;
  },

  // Discharge summary notification
  dischargeSummaryNotification: (data: {
    patientName: string;
    dischargeDate: string;
    totalBill: number;
    hospitalName: string;
  }): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

🎉 Discharge Summary

📅 Discharge Date: ${data.dischargeDate}
💰 Final Bill: ₹${data.totalBill.toLocaleString()}

Please complete the discharge formalities at the billing counter.

Your discharge summary and medications will be provided by the nursing staff.

Thank you for choosing us! Wishing you good health! 🙏`;
  },

  // Pharmacy order ready
  pharmacyOrderReady: (data: {
    patientName: string;
    orderNumber: string;
    hospitalName: string;
  }): string => {
    return `🏥 *${data.hospitalName}*

Dear ${data.patientName},

💊 Your medicines are ready!

📋 Order Number: ${data.orderNumber}

Please collect your medicines from our pharmacy counter.

Remember to follow your doctor's prescription carefully.

Get well soon! 🙏`;
  },
};

// Send notification using WhatsApp Business API (requires backend integration)
export const sendWhatsAppBusinessAPI = async (
  phone: string,
  templateName: string,
  templateData: Record<string, string>
): Promise<{ success: boolean; error?: string }> => {
  // This is a placeholder for WhatsApp Business API integration
  // In production, you would call your backend API which connects to WhatsApp Business API

  const apiEndpoint = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
  const apiToken = process.env.NEXT_PUBLIC_WHATSAPP_API_TOKEN;

  if (!apiEndpoint || !apiToken) {
    console.log('WhatsApp Business API not configured. Using web link fallback.');
    return { success: false, error: 'WhatsApp API not configured' };
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        phone: formatPhoneNumber(phone),
        template: templateName,
        data: templateData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return { success: true };
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return { success: false, error: 'Failed to send message' };
  }
};
