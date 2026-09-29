import { Observable } from "rxjs";
export declare const protobufPackage = "seat_type.v1";
export interface SeatType {
    id: string;
    arenaId: string;
    /** Стабильный ключ в рамках арены (`normal`, `vip`, ...). Пишется в Seat.type. */
    key: string;
    title: string;
    /** HEX-цвет для схемы зала и легенды (`#RRGGBB`). */
    color: string;
    sortOrder: number;
}
export interface ListSeatTypesRequest {
    arenaId: string;
}
export interface ListSeatTypesResponse {
    seatTypes: SeatType[];
}
export interface CreateSeatTypeRequest {
    arenaId: string;
    key: string;
    title: string;
    color: string;
    sortOrder?: number | undefined;
}
export interface UpdateSeatTypeRequest {
    id: string;
    title?: string | undefined;
    color?: string | undefined;
    sortOrder?: number | undefined;
}
export interface SeatTypeResponse {
    seatType: SeatType | undefined;
}
export interface DeleteSeatTypeRequest {
    id: string;
}
export interface DeleteSeatTypeResponse {
    ok: boolean;
}
export declare const SEAT_TYPE_V1_PACKAGE_NAME = "seat_type.v1";
/**
 * Типы мест конкретной арены (палитра для конструктора зала и легенды на
 * схеме, §11/§13 фронтенда). Каждая арена определяет свой набор: `normal`
 * сидится по умолчанию при создании арены, остальные (`vip`, `sofa`, «Ложа
 * Восток» и т.п.) заводит менеджер.
 *
 * `Seat.type` в seat.proto/sector.proto остаётся строкой = `SeatType.key`
 * (без FK), эта модель — справочник для отображения (title/color).
 */
export interface SeatTypeServiceClient {
    /** Типы мест арены. */
    listSeatTypes(request: ListSeatTypesRequest): Observable<ListSeatTypesResponse>;
    createSeatType(request: CreateSeatTypeRequest): Observable<SeatTypeResponse>;
    /** key неизменяем (на него ссылаются уже созданные места) — здесь его нет. */
    updateSeatType(request: UpdateSeatTypeRequest): Observable<SeatTypeResponse>;
    deleteSeatType(request: DeleteSeatTypeRequest): Observable<DeleteSeatTypeResponse>;
}
/**
 * Типы мест конкретной арены (палитра для конструктора зала и легенды на
 * схеме, §11/§13 фронтенда). Каждая арена определяет свой набор: `normal`
 * сидится по умолчанию при создании арены, остальные (`vip`, `sofa`, «Ложа
 * Восток» и т.п.) заводит менеджер.
 *
 * `Seat.type` в seat.proto/sector.proto остаётся строкой = `SeatType.key`
 * (без FK), эта модель — справочник для отображения (title/color).
 */
export interface SeatTypeServiceController {
    /** Типы мест арены. */
    listSeatTypes(request: ListSeatTypesRequest): Promise<ListSeatTypesResponse> | Observable<ListSeatTypesResponse> | ListSeatTypesResponse;
    createSeatType(request: CreateSeatTypeRequest): Promise<SeatTypeResponse> | Observable<SeatTypeResponse> | SeatTypeResponse;
    /** key неизменяем (на него ссылаются уже созданные места) — здесь его нет. */
    updateSeatType(request: UpdateSeatTypeRequest): Promise<SeatTypeResponse> | Observable<SeatTypeResponse> | SeatTypeResponse;
    deleteSeatType(request: DeleteSeatTypeRequest): Promise<DeleteSeatTypeResponse> | Observable<DeleteSeatTypeResponse> | DeleteSeatTypeResponse;
}
export declare function SeatTypeServiceControllerMethods(): (constructor: Function) => void;
export declare const SEAT_TYPE_SERVICE_NAME = "SeatTypeService";
