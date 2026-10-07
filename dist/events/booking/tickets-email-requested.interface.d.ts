export declare const TICKETS_EMAIL_REQUESTED = "booking.tickets.email_requested";
export interface TicketEmailItem {
    eventTitle: string;
    screeningDate: string;
    screeningTime: string;
    venueName: string;
    sectorName: string;
    row: number;
    number: number;
    /** data-URI PNG. */
    qrCode: string;
}
export interface TicketsEmailRequestedEvent {
    email: string;
    orderId: string;
    tickets: TicketEmailItem[];
    /**
     * 3.25.0 — редактор шаблонов писем (`GetEmailTemplate`/`SetEmailTemplate`,
     * per-event): booking-service уже резолвил переопределение для события
     * заказа (если есть) и передаёт готовую HTML-разметку с плейсхолдерами
     * `{{TICKETS_BLOCK}}`/`{{ORDER_ID}}` — notification-service просто
     * подставляет и шлёт, не заглядывая в booking-service. Пусто — обычный
     * `tickets.hbs`.
     */
    html?: string;
    /** Пусто — тема по умолчанию ("Ваш билет" / "Ваши билеты (N)"). */
    subject?: string;
    /** Организатор события заказа — письмо уходит через его SMTP, если настроен. */
    organizerId?: string;
}
