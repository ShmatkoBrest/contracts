"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEAT_SOLD = exports.SEAT_RELEASED = exports.SEAT_RESERVED = void 0;
// Публикуется booking-service при изменении статуса мест на сеансе.
// Потребляется gateway-service и ретранслируется во фронтенд по WebSocket
// (комната `screening:<screeningId>`) — живой статус схемы зала.
//
// Паттерны (routing key при emit): SEAT_RESERVED / SEAT_RELEASED / SEAT_SOLD.
exports.SEAT_RESERVED = 'seat.reserved';
exports.SEAT_RELEASED = 'seat.released';
exports.SEAT_SOLD = 'seat.sold';
