import { Observable } from "rxjs";
export declare const protobufPackage = "seat.v1";
export interface GetSeatRequest {
    id: string;
}
export interface GetSeatResponse {
    seat: Seat | undefined;
}
export interface GetSeatsRequest {
    ids: string[];
}
export interface GetSeatsResponse {
    seats: Seat[];
}
export interface ListSeatsRequest {
    sectorId: string;
    /** Пусто → вернуть места без статуса брони (для конструктора зала). */
    screeningId: string;
}
export interface ListSeatsResponse {
    seats: Seat[];
}
export interface Seat {
    id: string;
    row: number;
    number: number;
    status: string;
    type: string;
    sectorId: string;
    /** Координаты на схеме зала (для рендера SeatMap/конструктора). */
    x?: number | undefined;
    y?: number | undefined;
}
export declare const SEAT_V1_PACKAGE_NAME = "seat.v1";
export interface SeatServiceClient {
    /** Получение места по id */
    getSeat(request: GetSeatRequest): Observable<GetSeatResponse>;
    /**
     * Пакетное получение мест по списку id (booking-service при бронировании
     * на несколько мест — вместо N поштучных GetSeat). Статус брони не
     * вычисляется. Несуществующие id молча пропускаются.
     */
    getSeats(request: GetSeatsRequest): Observable<GetSeatsResponse>;
    /**
     * Места конкретного сектора — со статусом брони, если задан сеанс.
     *
     * 3.60.0: это ЕДИНСТВЕННЫЙ способ получить места, и вызывается он
     * только когда покупатель выбрал сектор. Обзорная схема зала мест не
     * запрашивает вообще: сектор закрашивается цветом своего ценового
     * тира, который и так уже известен из шаблонов цен. До этого схема
     * выгружала все места арены целиком (10 036 мест = 1.3 МБ JSON и ~2 с
     * на сборку ответа) — нагрузочный прогон показал, что это и было
     * главным узким местом платформы.
     */
    listSeatsBySector(request: ListSeatsRequest): Observable<ListSeatsResponse>;
}
export interface SeatServiceController {
    /** Получение места по id */
    getSeat(request: GetSeatRequest): Promise<GetSeatResponse> | Observable<GetSeatResponse> | GetSeatResponse;
    /**
     * Пакетное получение мест по списку id (booking-service при бронировании
     * на несколько мест — вместо N поштучных GetSeat). Статус брони не
     * вычисляется. Несуществующие id молча пропускаются.
     */
    getSeats(request: GetSeatsRequest): Promise<GetSeatsResponse> | Observable<GetSeatsResponse> | GetSeatsResponse;
    /**
     * Места конкретного сектора — со статусом брони, если задан сеанс.
     *
     * 3.60.0: это ЕДИНСТВЕННЫЙ способ получить места, и вызывается он
     * только когда покупатель выбрал сектор. Обзорная схема зала мест не
     * запрашивает вообще: сектор закрашивается цветом своего ценового
     * тира, который и так уже известен из шаблонов цен. До этого схема
     * выгружала все места арены целиком (10 036 мест = 1.3 МБ JSON и ~2 с
     * на сборку ответа) — нагрузочный прогон показал, что это и было
     * главным узким местом платформы.
     */
    listSeatsBySector(request: ListSeatsRequest): Promise<ListSeatsResponse> | Observable<ListSeatsResponse> | ListSeatsResponse;
}
export declare function SeatServiceControllerMethods(): (constructor: Function) => void;
export declare const SEAT_SERVICE_NAME = "SeatService";
