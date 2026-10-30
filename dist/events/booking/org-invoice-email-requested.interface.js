"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORG_INVOICE_EMAIL_REQUESTED = void 0;
// 4.31.0: публикуется booking-service (SendOrgBookingInvoiceEmail) через outbox,
// когда касса отправляет организации счёт по заявке. Потребляется
// notification-service: письмо с PDF-вложением.
exports.ORG_INVOICE_EMAIL_REQUESTED = 'booking.org_invoice.email_requested';
