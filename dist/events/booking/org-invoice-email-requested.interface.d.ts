export declare const ORG_INVOICE_EMAIL_REQUESTED = "booking.org_invoice.email_requested";
export interface OrgInvoiceEmailRequestedEvent {
    email: string;
    orgBookingId: string;
    orgName: string;
    /** Копейки. */
    totalAmount: number;
    filename: string;
    /** PDF в base64. */
    pdfBase64: string;
    organizerId?: string;
}
