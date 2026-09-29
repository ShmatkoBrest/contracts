import { Observable } from "rxjs";
export declare const protobufPackage = "analytics.v1";
/** from/to — ISO-строки (границы включительно по created_at). Пусто — весь период. */
export interface PeriodRequest {
    from?: string | undefined;
    to?: string | undefined;
    /** 3.14.0: сузить до события/группы событий (взаимоисключающе на стороне клиента). */
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface Overview {
    /** сумма amount оплаченных заказов */
    revenue: number;
    /** число оплаченных заказов */
    orders: number;
    /** число оплаченных билетов */
    tickets: number;
    /** revenue / orders (0 при orders = 0) */
    avgCheck: number;
    refundsAmount: number;
    refundsCount: number;
    /** payment_type IS NULL */
    onlineRevenue: number;
    /** payment_type IN (cash, terminal) */
    cashierRevenue: number;
}
export interface TimeseriesRequest {
    from?: string | undefined;
    to?: string | undefined;
    /** day | week (по умолчанию day) */
    bucket: string;
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface SalesTimeseries {
    points: TimeseriesPoint[];
}
export interface TimeseriesPoint {
    /** YYYY-MM-DD — начало бакета */
    date: string;
    revenue: number;
    orders: number;
    tickets: number;
}
export interface TopEventsRequest {
    from?: string | undefined;
    to?: string | undefined;
    /** по умолчанию 10 */
    limit: number;
    /** revenue | tickets (по умолчанию revenue) */
    sort: string;
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface TopEvents {
    items: TopEventItem[];
}
export interface TopEventItem {
    eventId: string;
    title: string;
    revenue: number;
    tickets: number;
}
export interface OccupancyRequest {
    /** фильтр по start_at сеанса */
    from?: string | undefined;
    to?: string | undefined;
    eventId?: string | undefined;
    /** по умолчанию 20 */
    limit: number;
    eventGroupId?: string | undefined;
}
export interface Occupancy {
    items: OccupancyItem[];
}
export interface OccupancyItem {
    screeningId: string;
    eventTitle: string;
    startAt: string;
    sectorName: string;
    /** число мест (RESERVED) или Sector.capacity (GA) */
    capacity: number;
    sold: number;
    /** sold / capacity */
    rate: number;
}
export interface CashierStats {
    cashiers: CashierStatItem[];
    shifts: ShiftStatItem[];
}
export interface CashierStatItem {
    cashierId: string;
    sales: number;
    revenue: number;
    cashRevenue: number;
    terminalRevenue: number;
}
export interface ShiftStatItem {
    shiftId: string;
    cashierId: string;
    openedAt: string;
    closedAt?: string | undefined;
    sales: number;
    revenue: number;
    cashTotal: number;
    terminalTotal: number;
    openingCash: number;
    countedCash?: number | undefined;
    difference?: number | undefined;
}
export interface OrganizerCommissionsRequest {
    /** Пусто — все организаторы. Задан — только этот (self-service). */
    organizerId?: string | undefined;
    /** Фильтр по created_at успешных платежей. Пусто — весь период. */
    from?: string | undefined;
    to?: string | undefined;
}
export interface OrganizerCommissions {
    items: OrganizerCommissionItem[];
}
export interface OrganizerCommissionItem {
    organizerId: string;
    title: string;
    /** Не задана — ставка не назначена этому организатору (считать нечего). */
    commissionPercent?: number | undefined;
    /** сумма успешных платежей организатора за период, копейки */
    revenue: number;
    paymentsCount: number;
    /** round(revenue * commission_percent / 100); отсутствует, если ставка не задана. */
    commissionAmount?: number | undefined;
}
export interface GetScreeningSummaryRequest {
    screeningId: string;
}
/**
 * Возвраты сюда НЕ входят (та же честная причина, что и в Overview — таблица
 * refunds в payment-service не хранит screening_id, сузить нечем).
 */
export interface ScreeningSummary {
    revenue: number;
    orders: number;
    tickets: number;
    avgCheck: number;
    onlineRevenue: number;
    cashierRevenue: number;
    /** сумма вместимости всех секторов арены сеанса */
    capacity: number;
    /** билетов PAID/RESERVED по всем секторам */
    sold: number;
    /** sold / capacity */
    occupancyRate: number;
    sectors: ScreeningSectorSummary[];
}
export interface ScreeningSectorSummary {
    sectorName: string;
    capacity: number;
    sold: number;
    rate: number;
}
/** 3.57.0: контроль на входе — см. AnalyticsService.GetCheckInStats. */
export interface CheckInStats {
    /** PAID-билеты сеанса (включая COMP) */
    totalTickets: number;
    checkedIn: number;
    remaining: number;
    /** ISO, не задано (пустая строка) — ни одного прохода ещё не было. */
    firstCheckInAt: string;
    lastCheckInAt: string;
}
export declare const ANALYTICS_V1_PACKAGE_NAME = "analytics.v1";
/**
 * Аналитика платформы для админ-дашборда. analytics-service читает БД
 * остальных сервисов read-only и агрегирует. Все суммы — в копейках.
 */
export interface AnalyticsServiceClient {
    /** Сводные KPI за период. */
    getOverview(request: PeriodRequest): Observable<Overview>;
    /** Динамика продаж по дням/неделям. */
    getSalesTimeseries(request: TimeseriesRequest): Observable<SalesTimeseries>;
    /** Топ событий по выручке/билетам. */
    getTopEvents(request: TopEventsRequest): Observable<TopEvents>;
    /** Заполняемость сеансов. */
    getOccupancy(request: OccupancyRequest): Observable<Occupancy>;
    /** Статистика по кассирам и сменам. */
    getCashierStats(request: PeriodRequest): Observable<CashierStats>;
    /**
     * 3.32.0: выручка + ставка комиссии + расчётная сумма к перечислению по
     * организатору(ам). Организатор платит комиссию сам — это только отчёт,
     * ничего не удерживается автоматически. organizer_id не задан — все
     * организаторы (платформенный ADMIN); задан — один (self-service
     * ORGANIZER_ADMIN, видит только себя).
     */
    listOrganizerCommissions(request: OrganizerCommissionsRequest): Observable<OrganizerCommissions>;
    /**
     * 3.35.0: сводка по одному сеансу (карточка сеанса в админке) — выручка/
     * билеты/заполняемость, без периода (сеанс — не диапазон дат).
     */
    getScreeningSummary(request: GetScreeningSummaryRequest): Observable<ScreeningSummary>;
    /**
     * 3.57.0: контроль на входе — сколько билетов уже прошло и за какой
     * промежуток времени (первый/последний скан). Отдельно от
     * ScreeningSummary — та кэшируется на 60с и несёт финансовые поля,
     * которые сканеру/контролю на входе видеть не нужно.
     */
    getCheckInStats(request: GetScreeningSummaryRequest): Observable<CheckInStats>;
}
/**
 * Аналитика платформы для админ-дашборда. analytics-service читает БД
 * остальных сервисов read-only и агрегирует. Все суммы — в копейках.
 */
export interface AnalyticsServiceController {
    /** Сводные KPI за период. */
    getOverview(request: PeriodRequest): Promise<Overview> | Observable<Overview> | Overview;
    /** Динамика продаж по дням/неделям. */
    getSalesTimeseries(request: TimeseriesRequest): Promise<SalesTimeseries> | Observable<SalesTimeseries> | SalesTimeseries;
    /** Топ событий по выручке/билетам. */
    getTopEvents(request: TopEventsRequest): Promise<TopEvents> | Observable<TopEvents> | TopEvents;
    /** Заполняемость сеансов. */
    getOccupancy(request: OccupancyRequest): Promise<Occupancy> | Observable<Occupancy> | Occupancy;
    /** Статистика по кассирам и сменам. */
    getCashierStats(request: PeriodRequest): Promise<CashierStats> | Observable<CashierStats> | CashierStats;
    /**
     * 3.32.0: выручка + ставка комиссии + расчётная сумма к перечислению по
     * организатору(ам). Организатор платит комиссию сам — это только отчёт,
     * ничего не удерживается автоматически. organizer_id не задан — все
     * организаторы (платформенный ADMIN); задан — один (self-service
     * ORGANIZER_ADMIN, видит только себя).
     */
    listOrganizerCommissions(request: OrganizerCommissionsRequest): Promise<OrganizerCommissions> | Observable<OrganizerCommissions> | OrganizerCommissions;
    /**
     * 3.35.0: сводка по одному сеансу (карточка сеанса в админке) — выручка/
     * билеты/заполняемость, без периода (сеанс — не диапазон дат).
     */
    getScreeningSummary(request: GetScreeningSummaryRequest): Promise<ScreeningSummary> | Observable<ScreeningSummary> | ScreeningSummary;
    /**
     * 3.57.0: контроль на входе — сколько билетов уже прошло и за какой
     * промежуток времени (первый/последний скан). Отдельно от
     * ScreeningSummary — та кэшируется на 60с и несёт финансовые поля,
     * которые сканеру/контролю на входе видеть не нужно.
     */
    getCheckInStats(request: GetScreeningSummaryRequest): Promise<CheckInStats> | Observable<CheckInStats> | CheckInStats;
}
export declare function AnalyticsServiceControllerMethods(): (constructor: Function) => void;
export declare const ANALYTICS_SERVICE_NAME = "AnalyticsService";
