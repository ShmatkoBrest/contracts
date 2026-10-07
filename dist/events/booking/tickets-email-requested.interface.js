"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKETS_EMAIL_REQUESTED = void 0;
// Публикуется booking-service (SendTicketsEmailUsecase) при запросе «отправить
// билеты на e-mail» — с account-страницы билета или с кассового чека.
// Потребляется notification-service, которая рендерит письмо с QR каждого
// билета (data-URI PNG, встраивается в HTML — без вложений) и отправляет.
exports.TICKETS_EMAIL_REQUESTED = 'booking.tickets.email_requested';
