import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp";
export declare const protobufPackage = "event.v1";
export interface ListEventsRequest {
    category: string;
    random: boolean;
    limit: number;
    /** Фильтры/пагинация (все опциональные, старое поведение при отсутствии): */
    q?: string | undefined;
    /** город/место (Event.place) */
    place?: string | undefined;
    organizerId?: string | undefined;
    performerId?: string | undefined;
    eventGroupId?: string | undefined;
    /** 1-based; 0 = без пагинации */
    page: number;
    pageSize: number;
    /**
     * 3.21.0: фильтр по набору id — используется gateway для «дата сеанса»
     * (event-service не знает о сеансах; gateway резолвит id событий с
     * сеансом в нужном диапазоне через screening-service и передаёт сюда).
     * Пусто — не фильтровать; непустой список без совпадений — 0 результатов
     * (не «фильтр не задан»).
     */
    ids: string[];
}
export interface ListEventsResponse {
    events: Event[];
    /** Всего по фильтру (для пагинации). 0, если пагинация не запрашивалась. */
    total: number;
}
export interface GetEventRequest {
    id?: string | undefined;
    slug?: string | undefined;
}
export interface GetEventResponse {
    event: EventDetails | undefined;
}
export interface CreateEventRequest {
    title: string;
    slug: string;
    description: string;
    poster: string;
    banner: string;
    duration: number;
    ratingAge: number;
    place: string;
    releaseDate: Timestamp | undefined;
    /** slug категории */
    category: string;
    organizerId?: string | undefined;
    performerIds: string[];
    eventGroupId?: string | undefined;
    /** 3.19.0: см. EventDetails.purchase_limit. */
    purchaseLimit?: number | undefined;
    /** См. EventDetails.price_tier_colors. */
    priceTierColors: string[];
}
/**
 * Обёртка нужна, чтобы отличить "поле не передано" (performer_ids не тронут
 * при обновлении) от "передан пустой список" (у события больше нет
 * исполнителей) — у repeated-полей в proto3 нет собственного presence.
 */
export interface PerformerIdList {
    ids: string[];
}
/**
 * Та же обёртка, что PerformerIdList — presence для repeated-поля в
 * UpdateEventRequest (undefined — не трогать палитру, [] — явный сброс на
 * дефолт фронта).
 */
export interface PriceTierColorsList {
    colors: string[];
}
export interface UpdateEventRequest {
    id: string;
    title?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    poster?: string | undefined;
    banner?: string | undefined;
    duration?: number | undefined;
    ratingAge?: number | undefined;
    place?: string | undefined;
    releaseDate?: Timestamp | undefined;
    /** slug категории */
    category?: string | undefined;
    organizerId?: string | undefined;
    performerIds: PerformerIdList | undefined;
    eventGroupId?: string | undefined;
    /**
     * 3.19.0: см. EventDetails.purchase_limit. Обёртка не нужна — 0
     * однозначно означало бы «без ограничения» (валидный кейс), а сам факт
     * presence уже различим через optional.
     */
    purchaseLimit?: number | undefined;
    priceTierColors: PriceTierColorsList | undefined;
}
export interface DeleteEventRequest {
    id: string;
}
export interface DeleteEventResponse {
    ok: boolean;
}
export interface Event {
    id: string;
    title: string;
    slug: string;
    poster: string;
    ratingAge: number;
    releaseDate: Timestamp | undefined;
}
export interface EventDetails {
    id: string;
    title: string;
    slug: string;
    description: string;
    poster: string;
    banner: string;
    duration: number;
    ratingAge: number;
    place: string;
    releaseDate: Timestamp | undefined;
    organizerId?: string | undefined;
    performerIds: string[];
    eventGroupId?: string | undefined;
    /**
     * 3.19.0: лимит продажи в одни руки — максимум билетов/GA-единиц на ОДИН
     * заказ (не накопительно за всё время) на сеансах этого события.
     * Не задан — без ограничения. Проверяет booking-service.
     */
    purchaseLimit?: number | undefined;
    /**
     * Палитра ценовых тиров карты стадиона (gateway/frontend, ArenaMap) —
     * сектор с самой низкой базовой ценой на сеансах события → colors[0],
     * следующий по цене → colors[1], и т.д. Пусто — фронт использует свою
     * дефолтную палитру (открытый список hex-цветов, не enum — админ может
     * задать любое число тиров).
     */
    priceTierColors: string[];
    /**
     * 3.59.0: категория события. Раньше её в ответе не было, и gateway
     * дорезолвивал категорию, загружая в память ВЕСЬ каталог событий по всем
     * категориям (loadCatalog) — на каждой странице события, с эффектом
     * cache stampede при протухании. Категория у события и так есть в БД
     * event-service, отдать её здесь дешевле на порядки.
     */
    category?: EventCategory | undefined;
}
/**
 * Категория в ответе события. Намеренно НЕ импортируем category.v1.Category:
 * ни один proto платформы не импортирует другой (самодостаточные файлы), да
 * и потребителю здесь нужны только эти три поля для отображения.
 */
export interface EventCategory {
    id: string;
    title: string;
    slug: string;
}
export declare const EVENT_V1_PACKAGE_NAME = "event.v1";
/** Сервис для работы с событиями */
export interface EventServiceClient {
    /** получение событий */
    listEvents(request: ListEventsRequest): Observable<ListEventsResponse>;
    /** получение события */
    getEvents(request: GetEventRequest): Observable<GetEventResponse>;
    /** создание события */
    createEvent(request: CreateEventRequest): Observable<GetEventResponse>;
    /** обновление события */
    updateEvent(request: UpdateEventRequest): Observable<GetEventResponse>;
    /** удаление события */
    deleteEvent(request: DeleteEventRequest): Observable<DeleteEventResponse>;
}
/** Сервис для работы с событиями */
export interface EventServiceController {
    /** получение событий */
    listEvents(request: ListEventsRequest): Promise<ListEventsResponse> | Observable<ListEventsResponse> | ListEventsResponse;
    /** получение события */
    getEvents(request: GetEventRequest): Promise<GetEventResponse> | Observable<GetEventResponse> | GetEventResponse;
    /** создание события */
    createEvent(request: CreateEventRequest): Promise<GetEventResponse> | Observable<GetEventResponse> | GetEventResponse;
    /** обновление события */
    updateEvent(request: UpdateEventRequest): Promise<GetEventResponse> | Observable<GetEventResponse> | GetEventResponse;
    /** удаление события */
    deleteEvent(request: DeleteEventRequest): Promise<DeleteEventResponse> | Observable<DeleteEventResponse> | DeleteEventResponse;
}
export declare function EventServiceControllerMethods(): (constructor: Function) => void;
export declare const EVENT_SERVICE_NAME = "EventService";
