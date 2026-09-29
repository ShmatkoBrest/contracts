import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp";
export declare const protobufPackage = "booking.v1";
export declare enum ShiftStatus {
    OPEN = 0,
    CLOSED = 1,
    UNRECOGNIZED = -1
}
export interface CreateCashierSaleRequest {
    cashierId: string;
    screeningId: string;
    seats: SeatInput[];
    /** cash | terminal */
    paymentType: string;
    /** id аккаунта покупателя, если есть; иначе продажа привязывается к кассиру. */
    customerId?: string | undefined;
    audienceCode?: string | undefined;
    promoCode?: string | undefined;
    /** Списать баллы лояльности покупателя (копейки; нужен customer_id). */
    redeemPoints: number;
    /** 3.19.0: GENERAL_ADMISSION-сектора — см. CreateReservationRequest.ga. */
    ga: GaInput[];
}
export interface CreateCashierSaleResponse {
    orderId: string;
    ticketIds: string[];
    amount: number;
    qrCode: string;
    /** 3.11.0: печатные представления каждого билета (отдельный QR на билет). */
    tickets: PrintableTicket[];
}
export interface OpenShiftRequest {
    cashierId: string;
    /** наличные в кассе на начало смены (копейки) */
    openingCash: number;
}
export interface CloseShiftRequest {
    cashierId: string;
    /** фактически пересчитанные наличные на конец смены (копейки) */
    countedCash: number;
}
export interface GetCurrentShiftRequest {
    cashierId: string;
}
export interface Shift {
    id: string;
    cashierId: string;
    status: ShiftStatus;
    openingCash: number;
    openedAt: Timestamp | undefined;
    closedAt?: Timestamp | undefined;
}
export interface ShiftReport {
    shift: Shift | undefined;
    salesCount: number;
    /** сумма всех продаж смены (копейки) */
    total: number;
    cashTotal: number;
    terminalTotal: number;
    /** opening_cash + cash_total */
    expectedCash: number;
    countedCash: number;
    /** counted_cash - expected_cash (отрицательное — недостача) */
    difference: number;
}
export interface ListShiftSalesRequest {
    cashierId: string;
    /** по умолчанию — текущая открытая смена */
    shiftId?: string | undefined;
}
export interface ListShiftSalesResponse {
    sales: CashierSaleItem[];
}
export interface CashierSaleItem {
    orderId: string;
    screeningId: string;
    amount: number;
    paymentType: string;
    soldAt: Timestamp | undefined;
}
export interface GetUserBookingsRequest {
    userId: string;
    /**
     * 2026-09-22: keyset-пагинация (тот же приём, что у ListOrders) — было
     * безлимитным, отдавало все оплаченные заказы пользователя разом.
     */
    cursor?: string | undefined;
    limit: number;
}
export interface GetUserBookingsResponse {
    bookings: BookingItem[];
    nextCursor?: string | undefined;
}
export interface GetBookingRequest {
    id: string;
    userId: string;
}
export interface GetBookingResponse {
    booking: BookingItem | undefined;
}
export interface CreateReservationRequest {
    userId: string;
    screeningId: string;
    seats: SeatInput[];
    audienceCode?: string | undefined;
    promoCode?: string | undefined;
    /**
     * 3.19.0: GENERAL_ADMISSION-сектора (без карты мест) — количество вместо
     * конкретных мест. Может сочетаться с seats в одном заказе (сеанс на
     * всей арене — разные сектора разного режима). Пуст у старых клиентов.
     */
    ga: GaInput[];
}
export interface CreateReservationResponse {
    orderId: string;
    ticketIds: string[];
    amount: number;
}
export interface SeatInput {
    seatId: string;
    /**
     * 3.18.0: категория (аудитория) конкретного места — например, один билет
     * детский, другой полный, в одной кассовой продаже. Читается только
     * CreateCashierSale; CreateReservation (online) её не передаёт — там вся
     * бронь одной категорией, как и раньше (см. top-level audience_code).
     */
    audienceCode?: string | undefined;
}
/**
 * 3.19.0: группа GENERAL_ADMISSION-мест одной категории в одном секторе —
 * сектор без нумерации, поэтому вместо repeated SeatInput передаётся
 * количество. Несколько GaInput с одним sector_id, но разным audience_code —
 * разбивка одной продажи по категориям (например, 2 полных + 1 детский).
 */
export interface GaInput {
    sectorId: string;
    quantity: number;
    /** Как и SeatInput.audience_code — читается только CreateCashierSale. */
    audienceCode?: string | undefined;
}
export interface ConfirmBookingRequest {
    bookingId: string;
    userId: string;
}
export interface ConfirmBookingResponse {
    ok: boolean;
}
export interface CancelBookingRequest {
    bookingId: string;
    userId: string;
}
export interface CancelBookingResponse {
    ok: boolean;
}
export interface GetOrderRefundEligibilityRequest {
    orderId: string;
}
export interface GetOrderRefundEligibilityResponse {
    refundable: boolean;
    /**
     * Пусто, если refundable = true. Иначе — машиночитаемая причина
     * ("ORDER_NOT_FOUND" | "EVENT_DAY_OR_PAST").
     */
    reason: string;
}
export interface ListReservedSeatsRequest {
    /**
     * 3.59.0: пусто — занятые места ВСЕХ секторов сеанса сразу. Нужно карте
     * арены целиком: раньше она спрашивала по одному вызову на сектор, то
     * есть 12 gRPC + 12 SQL на один просмотр страницы события.
     * (ListCompSeatIds использует это же сообщение, но там пустой sector_id
     * по-прежнему не применяется — вызывающая сторона всегда задаёт сектор.)
     */
    sectorId: string;
    screeningId: string;
}
export interface ListReservedSeatsResponse {
    reservedSeatIds: string[];
}
export interface GetGaAvailabilityRequest {
    screeningId: string;
    sectorId: string;
}
export interface GetGaAvailabilityResponse {
    /**
     * Число GA-билетов сектора на этот сеанс со статусом RESERVED|PAID
     * (неоплаченные брони освобождает ExpireReservationsService, как и для
     * обычных мест). Остаток вместимости = Sector.capacity (arena-service) − sold.
     */
    sold: number;
}
export interface SyncHoldRequest {
    userId: string;
    screeningId: string;
    /**
     * Желаемый ИТОГОВЫЙ набор — не дельта. Место, отсутствующее здесь, но
     * ранее удержанное этим пользователем на этот сеанс, освобождается.
     */
    seats: SeatInput[];
    ga: GaInput[];
    audienceCode?: string | undefined;
    promoCode?: string | undefined;
}
export interface SyncHoldResponse {
    /** Пусто, если после синка холд пуст (все места сняты из корзины). */
    orderId?: string | undefined;
    expiresAt?: Timestamp | undefined;
    amount: number;
    /**
     * seat_id из запроса, которые не удалось удержать — заняты другим
     * холдом/заказом; фронт должен снять их из локальной корзины.
     */
    seatConflicts: string[];
    /**
     * sector_id GA-групп, где запрошенное количество не поместилось
     * целиком в остаток вместимости (частично удержано, см. amount).
     */
    gaConflicts: string[];
}
export interface FinalizeHoldRequest {
    userId: string;
    screeningId: string;
}
export interface FinalizeHoldResponse {
    orderId: string;
    amount: number;
    /**
     * 3.30.0: организатор события сеанса — payment-service использует его,
     * чтобы провести оплату через реквизиты ИМЕННО этого организатора
     * (деньги напрямую ему), а не через реквизиты платформы по умолчанию.
     * Пусто — у события нет организатора либо он не задан.
     */
    organizerId: string;
}
export interface SendTicketsEmailRequest {
    orderId: string;
    email: string;
}
export interface SendTicketsEmailResponse {
    ok: boolean;
}
export interface BookingSeatInfo {
    id: string;
    row: number;
    number: number;
    /** 3.7.0: заказ может охватывать несколько секторов — сектор у каждого места. */
    sectorName: string;
    /** 3.11.0: отдельный билет и его QR (для термопечати и контроля на входе). */
    ticketId: string;
    /** data-URI PNG; у исторических билетов пусто — фолбэк на BookingItem.qr_code. */
    qrCode: string;
    /**
     * 3.58.0: короткий код для ручного ввода на входе (см. Ticket.shortCode,
     * 3.57.0) — показывается в личном кабинете под QR. У билетов, выпущенных
     * до 3.57.0, пусто (короткий код не генерировался).
     */
    shortCode: string;
    /**
     * 3.58.0: непусто, если билет уже был на входе (контроль на входе,
     * «проход») — личный кабинет отмечает такой билет как использованный.
     */
    checkedInAt: string;
}
export interface BookingEventInfo {
    id: string;
    title: string;
    poster: string;
}
export interface BookingArenaInfo {
    id: string;
    name: string;
}
export interface BookingItem {
    id: string;
    screeningDate: string;
    screeningTime: string;
    event: BookingEventInfo | undefined;
    arena: BookingArenaInfo | undefined;
    /** 6 (BookingSectorInfo sector) удалён в 3.7.0 — сектор теперь у каждого места. */
    seats: BookingSeatInfo[];
    qrCode: string;
    /** 3.11.0: SALE | COMP; статус заказа (PAID / VOIDED / ...). */
    kind: string;
    status: string;
}
/** Печатное представление одного билета (термопринтер / повторная печать). */
export interface PrintableTicket {
    ticketId: string;
    orderId: string;
    eventTitle: string;
    screeningDate: string;
    screeningTime: string;
    venueName: string;
    sectorName: string;
    row: number;
    number: number;
    /** копейки; у пригласительных 0. */
    price: number;
    /** строка, которую кодирует QR (обычно ticket_id). */
    qrData: string;
    isComp: boolean;
    /** 3.12.0: id события — чтобы выбрать макет печати события. */
    eventId: string;
    /**
     * 3.62.0: категория билета для печати — уже РАЗРЕШЁННОЕ название
     * («Детский»), не код: код живёт в pricing-service, и резолвить его на
     * каждой печатающей стороне отдельно смысла нет. Пусто, если категория
     * не задавалась или билет продан до 3.62.0 (у билетов на конкретное
     * место категория тогда не сохранялась).
     */
    audience: string;
}
export interface IssueComplimentaryRequest {
    screeningId: string;
    seats: SeatInput[];
    /** id админа, выдавшего пригласительные. */
    issuedBy: string;
    note: string;
    /**
     * 2026-09-18: GENERAL_ADMISSION-сектора — количество вместо конкретных
     * мест (тот же GaInput, что и у CreateCashierSale/CreateReservation;
     * audience_code им не читается — пригласительные всегда 0 ₽ независимо
     * от категории).
     */
    ga: GaInput[];
}
export interface IssueComplimentaryResponse {
    orderId: string;
    tickets: PrintableTicket[];
}
export interface VoidOrderRequest {
    orderId: string;
    actorId: string;
    reason: string;
}
export interface VoidOrderResponse {
    /** false, если заказ уже был VOIDED (идемпотентный no-op). */
    changed: boolean;
}
export interface ReissueOrderSeatsRequest {
    sourceOrderId: string;
    fromUserId: string;
    toUserId: string;
    /**
     * Сумма нового заказа (копейки) — назначает вызывающая сторона (для
     * перепродажи — цена N, выставленная продавцом), не пересчитывается
     * через pricing-service.
     */
    amount: number;
    reason: string;
    actorId: string;
}
export interface ReissueOrderSeatsResponse {
    orderId: string;
    ticketIds: string[];
}
export interface ArchiveScreeningCompsRequest {
    screeningId: string;
    actorId: string;
}
export interface ArchiveScreeningCompsResponse {
    voidedOrders: number;
}
export interface ListOrdersRequest {
    screeningId?: string | undefined;
    /** фильтр по статусу заказа; пусто = активные (без VOIDED). */
    status?: string | undefined;
    /** SALE | COMP; пусто = только SALE. */
    kind?: string | undefined;
    cursor?: string | undefined;
    limit: number;
}
export interface OrderListItem {
    id: string;
    kind: string;
    status: string;
    amount: number;
    createdAt: Timestamp | undefined;
    screeningId: string;
    eventTitle: string;
    seatCount: number;
    /** касса | онлайн | пригласительный — краткий признак для списка. */
    source: string;
}
export interface ListOrdersResponse {
    orders: OrderListItem[];
    nextCursor: string;
}
export interface ListTicketAuditRequest {
    screeningId?: string | undefined;
    from?: Timestamp | undefined;
    to?: Timestamp | undefined;
    /** ISSUED_COMP | VOIDED | COMP_ARCHIVED */
    action?: string | undefined;
    cursor?: string | undefined;
    limit: number;
}
export interface TicketAuditItem {
    id: string;
    action: string;
    actorId: string;
    orderId: string;
    ticketId: string;
    reason: string;
    createdAt: Timestamp | undefined;
    metaJson: string;
}
export interface ListTicketAuditResponse {
    entries: TicketAuditItem[];
    nextCursor: string;
}
export interface GetPrintableTicketsRequest {
    orderId: string;
}
export interface GetPrintableTicketsResponse {
    tickets: PrintableTicket[];
}
export interface ValidateTicketRequest {
    /**
     * Принимает id билета ИЛИ его короткий код (Ticket.shortCode, 3.57.0) —
     * вызывающая сторона не обязана знать, что именно отсканировано/введено.
     */
    ticketId: string;
    /**
     * 3.57.0: если задан — статус получает значение WRONG_SCREENING, когда
     * билет существует, но выписан на другой сеанс (контроль «не тот вход»).
     */
    screeningId?: string | undefined;
}
export interface ValidateTicketResponse {
    /** true, только если билет активен (PAID и не VOIDED). */
    valid: boolean;
    /** PAID | VOIDED | RESERVED | NOT_FOUND | WRONG_SCREENING */
    status: string;
    isComp: boolean;
    eventTitle: string;
    screeningDate: string;
    screeningTime: string;
    venueName: string;
    sectorName: string;
    row: number;
    number: number;
    /**
     * 3.57.0: заполнено, если билет уже был на входе (для честной
     * информационной подсказки — не только режим «проход» это видит).
     */
    checkedInAt?: string | undefined;
    checkedInBy: string;
}
export interface CheckInTicketRequest {
    /** id билета ИЛИ короткий код — см. ValidateTicketRequest. */
    ticketId: string;
    screeningId: string;
    /** id аккаунта, выполняющего проход (контролёр/админ-организатор/админ). */
    actorId: string;
}
export interface CheckInTicketResponse {
    /** OK | NOT_FOUND | WRONG_SCREENING | NOT_PAID | ALREADY_CHECKED_IN */
    status: string;
    isComp: boolean;
    eventTitle: string;
    screeningDate: string;
    screeningTime: string;
    venueName: string;
    sectorName: string;
    row: number;
    number: number;
    /**
     * Заполнено при OK (только что записанное) и ALREADY_CHECKED_IN
     * (существовавшее раньше — для redflag-сообщения «кем и когда»).
     */
    checkedInAt: string;
    checkedInBy: string;
}
export interface ReleaseTicketRequest {
    /** id билета ИЛИ короткий код — см. ValidateTicketRequest. */
    ticketId: string;
    screeningId: string;
    /** id аккаунта, выполняющего «выпуск» (охрана/админ-организатор/админ). */
    actorId: string;
}
export interface ReleaseTicketResponse {
    /**
     * OK (отметка снята) | NOT_FOUND | WRONG_SCREENING | NOT_CHECKED_IN
     * (билет не проходил — снимать нечего).
     */
    status: string;
    isComp: boolean;
    eventTitle: string;
    screeningDate: string;
    screeningTime: string;
    venueName: string;
    sectorName: string;
    row: number;
    number: number;
}
export interface GetPrintTemplateRequest {
    /**
     * 3.12.0: пусто = общий макет по умолчанию; иначе — макет события
     * (с откатом на умолчание, если у события своего нет).
     */
    eventId: string;
}
export interface GetPrintTemplateResponse {
    /** JSON-строка с настройками макета. */
    settingsJson: string;
    /** 3.12.0: true, если вернулся макет самого события, а не общий по умолчанию. */
    isOverride: boolean;
}
export interface SetPrintTemplateRequest {
    settingsJson: string;
    /** 3.12.0: пусто = общий макет по умолчанию. */
    eventId: string;
    /** 3.12.0: true + event_id → удалить макет события (вернуться к умолчанию). */
    delete: boolean;
}
export interface SetPrintTemplateResponse {
    ok: boolean;
}
export interface GetEmailTemplateRequest {
    /**
     * 3.25.0: пусто = общий шаблон по умолчанию; иначе — шаблон события
     * (с откатом на умолчание, если у события своего нет).
     */
    eventId: string;
}
export interface GetEmailTemplateResponse {
    /**
     * Полная HTML-разметка письма (WYSIWYG-редактор на фронте); содержит
     * плейсхолдеры {{TICKETS_BLOCK}}/{{ORDER_ID}}, которые notification-service
     * подставляет при отправке.
     */
    html: string;
    /**
     * Пусто = тема письма считается по умолчанию (notification-service сам
     * решает "Ваш билет" / "Ваши билеты (N)").
     */
    subject: string;
    /** true, если вернулся шаблон самого события, а не общий по умолчанию. */
    isOverride: boolean;
}
export interface SetEmailTemplateRequest {
    html: string;
    subject: string;
    /** Пусто = общий шаблон по умолчанию. */
    eventId: string;
    /** true + event_id → удалить шаблон события (вернуться к умолчанию). */
    delete: boolean;
}
export interface SetEmailTemplateResponse {
    ok: boolean;
}
export declare const BOOKING_V1_PACKAGE_NAME = "booking.v1";
export interface BookingServiceClient {
    /** Получение всех активных броней пользователя */
    getUserBookings(request: GetUserBookingsRequest): Observable<GetUserBookingsResponse>;
    /** Получение одной брони по id (с проверкой владельца) */
    getBooking(request: GetBookingRequest): Observable<GetBookingResponse>;
    /** создание брони */
    createReservation(request: CreateReservationRequest): Observable<CreateReservationResponse>;
    /** подтверждение брони */
    confirmBooking(request: ConfirmBookingRequest): Observable<ConfirmBookingResponse>;
    /** отмена брони (при возврате платежа) */
    cancelBooking(request: CancelBookingRequest): Observable<CancelBookingResponse>;
    /**
     * 2026-09-22: можно ли ещё вернуть этот заказ (правило "не в день
     * мероприятия и не позже") — payment-service спрашивает ДО обращения к
     * платёжному провайдеру, чтобы не разрешать возврат просроченных билетов.
     */
    getOrderRefundEligibility(request: GetOrderRefundEligibilityRequest): Observable<GetOrderRefundEligibilityResponse>;
    /** получение занятых мест */
    listReservedSeats(request: ListReservedSeatsRequest): Observable<ListReservedSeatsResponse>;
    /**
     * 2026-09-18: места сектора, занятые пригласительными билетами (Order.kind
     * = COMP) на этот сеанс — для раскраски карты мест на странице
     * пригласительных (отдельно от «занято» вообще, тот же формат сообщений,
     * что у ListReservedSeats).
     */
    listCompSeatIds(request: ListReservedSeatsRequest): Observable<ListReservedSeatsResponse>;
    /**
     * 3.19.0: сколько GENERAL_ADMISSION-билетов уже продано/держится брони
     * в секторе без нумерации мест на этот сеанс (для остатка вместимости —
     * capacity сектора знает только arena-service, а не booking).
     */
    getGaAvailability(request: GetGaAvailabilityRequest): Observable<GetGaAvailabilityResponse>;
    /**
     * 3.22.0: TTL-холд корзины online-покупки — реальная серверная бронь
     * мест/GA-единиц уже в момент выбора (не только на чекауте), до 10 минут
     * с продлением при каждой синхронизации корзины. Снятое с корзины место
     * освобождается сразу же следующим вызовом (не входит в seats/ga).
     */
    syncHold(request: SyncHoldRequest): Observable<SyncHoldResponse>;
    /**
     * Финализация холда перед оплатой — payment-service берёт отсюда
     * orderId/amount вместо повторного CreateReservation (холд уже всё
     * провалидировал и посчитал при последней синхронизации).
     */
    finalizeHold(request: FinalizeHoldRequest): Observable<FinalizeHoldResponse>;
    /**
     * 3.23.0: отправить все билеты заказа на e-mail (каждый билет — со своим
     * QR, письмо рендерит notification-service). Только для PAID-заказов.
     */
    sendTicketsEmail(request: SendTicketsEmailRequest): Observable<SendTicketsEmailResponse>;
    /**
     * ===== Касса: смены и продажи =====
     * Продажа на кассе: бронь + подтверждение + учёт в открытой смене кассира.
     */
    createCashierSale(request: CreateCashierSaleRequest): Observable<CreateCashierSaleResponse>;
    /** Открыть смену (одна открытая смена на кассира). */
    openShift(request: OpenShiftRequest): Observable<Shift>;
    /** Закрыть смену — возвращает отчёт со сверкой кассы. */
    closeShift(request: CloseShiftRequest): Observable<ShiftReport>;
    /** Текущая открытая смена кассира (NOT_FOUND, если нет). */
    getCurrentShift(request: GetCurrentShiftRequest): Observable<Shift>;
    /** Продажи смены. */
    listShiftSales(request: ListShiftSalesRequest): Observable<ListShiftSalesResponse>;
    /**
     * ===== 3.11.0: пригласительные, аннулирование, журнал, печать =====
     * Выдать пригласительные билеты (0 ₽, без оплаты) — только ADMIN.
     */
    issueComplimentary(request: IssueComplimentaryRequest): Observable<IssueComplimentaryResponse>;
    /**
     * Аннулировать заказ: место освобождается, билеты → VOIDED, запись в журнал.
     * Идемпотентно. Деньги покупателю НЕ возвращаются (это отдельная операция).
     */
    voidOrder(request: VoidOrderRequest): Observable<VoidOrderResponse>;
    /**
     * 2026-09-21: атомарная передача мест заказа другому пользователю —
     * билеты source_order_id → VOIDED (audit action REISSUED), новый PAID-
     * заказ на те же места создаётся to_user_id одной транзакцией (место НЕ
     * становится свободным ни на миг — частичный уникальный индекс покрывает
     * только RESERVED/PAID). Организатор/сеанс наследуются от source-заказа.
     * Вне транзакции, мягко: клобэк баллов лояльности продавца за старый
     * заказ + начисление покупателю за новый (тот же LoyaltyPort, что уже
     * используют ConfirmBooking/VoidOrder) — для перепродажи места по
     * абонементу (subscription-service.BuyResaleListing).
     */
    reissueOrderSeats(request: ReissueOrderSeatsRequest): Observable<ReissueOrderSeatsResponse>;
    /** Убрать все пригласительные сеанса после матча (bulk void). */
    archiveScreeningComps(request: ArchiveScreeningCompsRequest): Observable<ArchiveScreeningCompsResponse>;
    /** Админский список заказов (по умолчанию без VOIDED и COMP). */
    listOrders(request: ListOrdersRequest): Observable<ListOrdersResponse>;
    /** Журнал действий по билетам (выдача пригласительных / аннулирование). */
    listTicketAudit(request: ListTicketAuditRequest): Observable<ListTicketAuditResponse>;
    /** Печатные представления билетов заказа (для термопечати / повторной печати). */
    getPrintableTickets(request: GetPrintableTicketsRequest): Observable<GetPrintableTicketsResponse>;
    /**
     * Проверка билета по id/короткому коду из QR (контроль на входе,
     * режим «информация»). Read-only. 3.57.0 — принимает и screening_id
     * (сверка на «не тот вход»), и короткий код билета, не только id.
     */
    validateTicket(request: ValidateTicketRequest): Observable<ValidateTicketResponse>;
    /**
     * 3.57.0: контроль на входе, режим «проход» — атомарно фиксирует время
     * прохода. Второй скан того же билета — ALREADY_CHECKED_IN, не перезаписывает.
     */
    checkInTicket(request: CheckInTicketRequest): Observable<CheckInTicketResponse>;
    /**
     * 3.58.0: контроль на входе, режим «выпустить» — снимает отметку прохода
     * (checked_in_at/by → null), НЕ пишет отдельное время выхода. Только для
     * роли «охрана»/ORGANIZER_ADMIN/ADMIN — доступ проверяет gateway-service,
     * сам RPC доступен любому вызывающему (как и CheckInTicket).
     */
    releaseTicket(request: ReleaseTicketRequest): Observable<ReleaseTicketResponse>;
    /** Макет термопечати: общий по умолчанию + переопределения под событие (3.12.0). */
    getPrintTemplate(request: GetPrintTemplateRequest): Observable<GetPrintTemplateResponse>;
    setPrintTemplate(request: SetPrintTemplateRequest): Observable<SetPrintTemplateResponse>;
    /** Шаблон письма с билетами: общий по умолчанию + переопределения под событие (3.25.0). */
    getEmailTemplate(request: GetEmailTemplateRequest): Observable<GetEmailTemplateResponse>;
    setEmailTemplate(request: SetEmailTemplateRequest): Observable<SetEmailTemplateResponse>;
}
export interface BookingServiceController {
    /** Получение всех активных броней пользователя */
    getUserBookings(request: GetUserBookingsRequest): Promise<GetUserBookingsResponse> | Observable<GetUserBookingsResponse> | GetUserBookingsResponse;
    /** Получение одной брони по id (с проверкой владельца) */
    getBooking(request: GetBookingRequest): Promise<GetBookingResponse> | Observable<GetBookingResponse> | GetBookingResponse;
    /** создание брони */
    createReservation(request: CreateReservationRequest): Promise<CreateReservationResponse> | Observable<CreateReservationResponse> | CreateReservationResponse;
    /** подтверждение брони */
    confirmBooking(request: ConfirmBookingRequest): Promise<ConfirmBookingResponse> | Observable<ConfirmBookingResponse> | ConfirmBookingResponse;
    /** отмена брони (при возврате платежа) */
    cancelBooking(request: CancelBookingRequest): Promise<CancelBookingResponse> | Observable<CancelBookingResponse> | CancelBookingResponse;
    /**
     * 2026-09-22: можно ли ещё вернуть этот заказ (правило "не в день
     * мероприятия и не позже") — payment-service спрашивает ДО обращения к
     * платёжному провайдеру, чтобы не разрешать возврат просроченных билетов.
     */
    getOrderRefundEligibility(request: GetOrderRefundEligibilityRequest): Promise<GetOrderRefundEligibilityResponse> | Observable<GetOrderRefundEligibilityResponse> | GetOrderRefundEligibilityResponse;
    /** получение занятых мест */
    listReservedSeats(request: ListReservedSeatsRequest): Promise<ListReservedSeatsResponse> | Observable<ListReservedSeatsResponse> | ListReservedSeatsResponse;
    /**
     * 2026-09-18: места сектора, занятые пригласительными билетами (Order.kind
     * = COMP) на этот сеанс — для раскраски карты мест на странице
     * пригласительных (отдельно от «занято» вообще, тот же формат сообщений,
     * что у ListReservedSeats).
     */
    listCompSeatIds(request: ListReservedSeatsRequest): Promise<ListReservedSeatsResponse> | Observable<ListReservedSeatsResponse> | ListReservedSeatsResponse;
    /**
     * 3.19.0: сколько GENERAL_ADMISSION-билетов уже продано/держится брони
     * в секторе без нумерации мест на этот сеанс (для остатка вместимости —
     * capacity сектора знает только arena-service, а не booking).
     */
    getGaAvailability(request: GetGaAvailabilityRequest): Promise<GetGaAvailabilityResponse> | Observable<GetGaAvailabilityResponse> | GetGaAvailabilityResponse;
    /**
     * 3.22.0: TTL-холд корзины online-покупки — реальная серверная бронь
     * мест/GA-единиц уже в момент выбора (не только на чекауте), до 10 минут
     * с продлением при каждой синхронизации корзины. Снятое с корзины место
     * освобождается сразу же следующим вызовом (не входит в seats/ga).
     */
    syncHold(request: SyncHoldRequest): Promise<SyncHoldResponse> | Observable<SyncHoldResponse> | SyncHoldResponse;
    /**
     * Финализация холда перед оплатой — payment-service берёт отсюда
     * orderId/amount вместо повторного CreateReservation (холд уже всё
     * провалидировал и посчитал при последней синхронизации).
     */
    finalizeHold(request: FinalizeHoldRequest): Promise<FinalizeHoldResponse> | Observable<FinalizeHoldResponse> | FinalizeHoldResponse;
    /**
     * 3.23.0: отправить все билеты заказа на e-mail (каждый билет — со своим
     * QR, письмо рендерит notification-service). Только для PAID-заказов.
     */
    sendTicketsEmail(request: SendTicketsEmailRequest): Promise<SendTicketsEmailResponse> | Observable<SendTicketsEmailResponse> | SendTicketsEmailResponse;
    /**
     * ===== Касса: смены и продажи =====
     * Продажа на кассе: бронь + подтверждение + учёт в открытой смене кассира.
     */
    createCashierSale(request: CreateCashierSaleRequest): Promise<CreateCashierSaleResponse> | Observable<CreateCashierSaleResponse> | CreateCashierSaleResponse;
    /** Открыть смену (одна открытая смена на кассира). */
    openShift(request: OpenShiftRequest): Promise<Shift> | Observable<Shift> | Shift;
    /** Закрыть смену — возвращает отчёт со сверкой кассы. */
    closeShift(request: CloseShiftRequest): Promise<ShiftReport> | Observable<ShiftReport> | ShiftReport;
    /** Текущая открытая смена кассира (NOT_FOUND, если нет). */
    getCurrentShift(request: GetCurrentShiftRequest): Promise<Shift> | Observable<Shift> | Shift;
    /** Продажи смены. */
    listShiftSales(request: ListShiftSalesRequest): Promise<ListShiftSalesResponse> | Observable<ListShiftSalesResponse> | ListShiftSalesResponse;
    /**
     * ===== 3.11.0: пригласительные, аннулирование, журнал, печать =====
     * Выдать пригласительные билеты (0 ₽, без оплаты) — только ADMIN.
     */
    issueComplimentary(request: IssueComplimentaryRequest): Promise<IssueComplimentaryResponse> | Observable<IssueComplimentaryResponse> | IssueComplimentaryResponse;
    /**
     * Аннулировать заказ: место освобождается, билеты → VOIDED, запись в журнал.
     * Идемпотентно. Деньги покупателю НЕ возвращаются (это отдельная операция).
     */
    voidOrder(request: VoidOrderRequest): Promise<VoidOrderResponse> | Observable<VoidOrderResponse> | VoidOrderResponse;
    /**
     * 2026-09-21: атомарная передача мест заказа другому пользователю —
     * билеты source_order_id → VOIDED (audit action REISSUED), новый PAID-
     * заказ на те же места создаётся to_user_id одной транзакцией (место НЕ
     * становится свободным ни на миг — частичный уникальный индекс покрывает
     * только RESERVED/PAID). Организатор/сеанс наследуются от source-заказа.
     * Вне транзакции, мягко: клобэк баллов лояльности продавца за старый
     * заказ + начисление покупателю за новый (тот же LoyaltyPort, что уже
     * используют ConfirmBooking/VoidOrder) — для перепродажи места по
     * абонементу (subscription-service.BuyResaleListing).
     */
    reissueOrderSeats(request: ReissueOrderSeatsRequest): Promise<ReissueOrderSeatsResponse> | Observable<ReissueOrderSeatsResponse> | ReissueOrderSeatsResponse;
    /** Убрать все пригласительные сеанса после матча (bulk void). */
    archiveScreeningComps(request: ArchiveScreeningCompsRequest): Promise<ArchiveScreeningCompsResponse> | Observable<ArchiveScreeningCompsResponse> | ArchiveScreeningCompsResponse;
    /** Админский список заказов (по умолчанию без VOIDED и COMP). */
    listOrders(request: ListOrdersRequest): Promise<ListOrdersResponse> | Observable<ListOrdersResponse> | ListOrdersResponse;
    /** Журнал действий по билетам (выдача пригласительных / аннулирование). */
    listTicketAudit(request: ListTicketAuditRequest): Promise<ListTicketAuditResponse> | Observable<ListTicketAuditResponse> | ListTicketAuditResponse;
    /** Печатные представления билетов заказа (для термопечати / повторной печати). */
    getPrintableTickets(request: GetPrintableTicketsRequest): Promise<GetPrintableTicketsResponse> | Observable<GetPrintableTicketsResponse> | GetPrintableTicketsResponse;
    /**
     * Проверка билета по id/короткому коду из QR (контроль на входе,
     * режим «информация»). Read-only. 3.57.0 — принимает и screening_id
     * (сверка на «не тот вход»), и короткий код билета, не только id.
     */
    validateTicket(request: ValidateTicketRequest): Promise<ValidateTicketResponse> | Observable<ValidateTicketResponse> | ValidateTicketResponse;
    /**
     * 3.57.0: контроль на входе, режим «проход» — атомарно фиксирует время
     * прохода. Второй скан того же билета — ALREADY_CHECKED_IN, не перезаписывает.
     */
    checkInTicket(request: CheckInTicketRequest): Promise<CheckInTicketResponse> | Observable<CheckInTicketResponse> | CheckInTicketResponse;
    /**
     * 3.58.0: контроль на входе, режим «выпустить» — снимает отметку прохода
     * (checked_in_at/by → null), НЕ пишет отдельное время выхода. Только для
     * роли «охрана»/ORGANIZER_ADMIN/ADMIN — доступ проверяет gateway-service,
     * сам RPC доступен любому вызывающему (как и CheckInTicket).
     */
    releaseTicket(request: ReleaseTicketRequest): Promise<ReleaseTicketResponse> | Observable<ReleaseTicketResponse> | ReleaseTicketResponse;
    /** Макет термопечати: общий по умолчанию + переопределения под событие (3.12.0). */
    getPrintTemplate(request: GetPrintTemplateRequest): Promise<GetPrintTemplateResponse> | Observable<GetPrintTemplateResponse> | GetPrintTemplateResponse;
    setPrintTemplate(request: SetPrintTemplateRequest): Promise<SetPrintTemplateResponse> | Observable<SetPrintTemplateResponse> | SetPrintTemplateResponse;
    /** Шаблон письма с билетами: общий по умолчанию + переопределения под событие (3.25.0). */
    getEmailTemplate(request: GetEmailTemplateRequest): Promise<GetEmailTemplateResponse> | Observable<GetEmailTemplateResponse> | GetEmailTemplateResponse;
    setEmailTemplate(request: SetEmailTemplateRequest): Promise<SetEmailTemplateResponse> | Observable<SetEmailTemplateResponse> | SetEmailTemplateResponse;
}
export declare function BookingServiceControllerMethods(): (constructor: Function) => void;
export declare const BOOKING_SERVICE_NAME = "BookingService";
