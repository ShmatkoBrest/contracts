export declare const SEAT_RESERVED = "seat.reserved";
export declare const SEAT_RELEASED = "seat.released";
export declare const SEAT_SOLD = "seat.sold";
export type SeatStatusEventPattern = typeof SEAT_RESERVED | typeof SEAT_RELEASED | typeof SEAT_SOLD;
export interface SeatStatusChangedEvent {
    screeningId: string;
    sectorId: string;
    seatIds: string[];
    at: string;
}
