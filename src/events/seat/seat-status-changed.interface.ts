// Публикуется booking-service при изменении статуса мест на сеансе.
// Потребляется gateway-service и ретранслируется во фронтенд по WebSocket
// (комната `screening:<screeningId>`) — живой статус схемы зала.
//
// Паттерны (routing key при emit): SEAT_RESERVED / SEAT_RELEASED / SEAT_SOLD.
export const SEAT_RESERVED = 'seat.reserved';
export const SEAT_RELEASED = 'seat.released';
export const SEAT_SOLD = 'seat.sold';

export type SeatStatusEventPattern =
    | typeof SEAT_RESERVED
    | typeof SEAT_RELEASED
    | typeof SEAT_SOLD;

export interface SeatStatusChangedEvent {
    screeningId: string;
    sectorId: string;
    seatIds: string[];
    // ISO-время события
    at: string;
}
