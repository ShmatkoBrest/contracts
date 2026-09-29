import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp";
export declare const protobufPackage = "pricing.v1";
export declare enum RuleType {
    DISCOUNT = 0,
    SURCHARGE = 1,
    FIXED_PRICE = 2,
    UNRECOGNIZED = -1
}
export declare enum ValueType {
    PERCENT = 0,
    FIXED = 1,
    UNRECOGNIZED = -1
}
export interface CalculatePriceRequest {
    screeningId: string;
    sectorId: string;
    /** Пусто для GENERAL_ADMISSION-секторов без конкретных мест. */
    seatId?: string | undefined;
    userId: string;
    audienceCode?: string | undefined;
    promoCode?: string | undefined;
    /**
     * Кол-во билетов в этом расчёте (для условий вида ticket_count >= 3
     * и для GENERAL_ADMISSION, где нет отдельного seat_id на каждый билет).
     */
    quantity: number;
    /**
     * Момент "покупки" для условий вида purchase_date <= X (Early Bird
     * и т.п.). Если не передан — используется текущее время сервера.
     */
    purchaseDate?: Timestamp | undefined;
    /**
     * 2026-09-22: событие/группа события сеанса — резолвится вызывающей
     * стороной (screening -> event хоп), pricing-service остаётся чистым
     * калькулятором без собственного gRPC-клиента к event-service. Нужны
     * для матчинга PricingRuleScope.event_id/event_group_id.
     */
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface CalculatePriceResponse {
    basePrice: number;
    discount: number;
    surcharge: number;
    finalPrice: number;
    rules: AppliedRule[];
    /**
     * id созданного PriceSnapshot — передаётся в booking-service при
     * создании билета для последующей трассируемости расчёта.
     */
    snapshotId: string;
    /** Бонусные баллы за применённый промокод (loyalty.v1) — копейки. */
    promoBonusPoints: number;
}
export interface AppliedRule {
    name: string;
    amount: number;
}
export interface CalculatePricesItem {
    sectorId: string;
    /** Пусто для GENERAL_ADMISSION-секторов без конкретных мест. */
    seatId?: string | undefined;
}
export interface CalculatePricesRequest {
    screeningId: string;
    userId: string;
    items: CalculatePricesItem[];
    audienceCode?: string | undefined;
    promoCode?: string | undefined;
    /** Общее число билетов в заказе (для условий ticket_count). 0 → items.length. */
    quantity: number;
    purchaseDate?: Timestamp | undefined;
    /** См. CalculatePriceRequest.event_id/event_group_id. */
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface CalculatePricesResult {
    /** Эхо seat_id из запроса ('' для GA). */
    seatId: string;
    finalPrice: number;
    snapshotId: string;
}
export interface CalculatePricesResponse {
    results: CalculatePricesResult[];
}
export interface SetPriceTemplateRequest {
    screeningId: string;
    sectorId: string;
    basePrice: number;
}
export interface GetPriceTemplateRequest {
    screeningId: string;
    sectorId: string;
}
export interface ListPriceTemplatesRequest {
    screeningId: string;
}
export interface ListPriceTemplatesResponse {
    templates: PriceTemplate[];
}
export interface PriceTemplate {
    id: string;
    screeningId: string;
    sectorId: string;
    basePrice: number;
}
export interface SetSeatPriceOverrideRequest {
    screeningId: string;
    seatId: string;
    price: number;
}
export interface DeleteSeatPriceOverrideRequest {
    screeningId: string;
    seatId: string;
}
export interface SeatPriceOverride {
    id: string;
    screeningId: string;
    seatId: string;
    price: number;
}
export interface PricingRuleScopeInput {
    screeningId?: string | undefined;
    sectorId?: string | undefined;
    seatId?: string | undefined;
    /**
     * 2026-09-22: область действия по событию/группе событий — независимо
     * от screening/sector/seat (все поля одной записи — AND, незаданные —
     * wildcard, см. PricingRuleScope в schema.prisma).
     */
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface PricingRuleConditionInput {
    /** Поддерживаемые поля: purchase_date, ticket_count, audience. */
    field: string;
    /** Поддерживаемые операторы: EQ, NEQ, GT, GTE, LT, LTE, IN. */
    operator: string;
    value: string;
}
export interface CreatePricingRuleRequest {
    code?: string | undefined;
    name: string;
    priority: number;
    ruleType: RuleType;
    valueType: ValueType;
    value: number;
    combinable: boolean;
    validFrom?: Timestamp | undefined;
    validTo?: Timestamp | undefined;
    scopes: PricingRuleScopeInput[];
    conditions: PricingRuleConditionInput[];
}
/**
 * `repeated` полей без обёртки недостаточно — proto3 не различает "поле не
 * передано" и "передан пустой список" для repeated (в отличие от scalar
 * optional). Оборачиваем в message, чтобы `optional` ниже реально отличал
 * "не трогать scopes/conditions" (поле отсутствует) от "заменить на пустой
 * список" (поле присутствует, scopes: [] внутри — правило становится
 * глобальным). Без этого, например, вызов "только вкл/выкл активность"
 * (шлёт один active, без scopes) молча стёр бы всю область действия правила.
 */
export interface PricingRuleScopesPatch {
    scopes: PricingRuleScopeInput[];
}
export interface PricingRuleConditionsPatch {
    conditions: PricingRuleConditionInput[];
}
export interface UpdatePricingRuleRequest {
    id: string;
    name?: string | undefined;
    active?: boolean | undefined;
    priority?: number | undefined;
    value?: number | undefined;
    combinable?: boolean | undefined;
    validFrom?: Timestamp | undefined;
    validTo?: Timestamp | undefined;
    /**
     * 2026-09-22: раньше тип/область/условия правила нельзя было изменить —
     * только пересоздать правило целиком.
     */
    ruleType?: RuleType | undefined;
    valueType?: ValueType | undefined;
    scopes?: PricingRuleScopesPatch | undefined;
    conditions?: PricingRuleConditionsPatch | undefined;
}
export interface DeletePricingRuleRequest {
    id: string;
}
export interface ListPricingRulesRequest {
    activeOnly?: boolean | undefined;
}
export interface ListPricingRulesResponse {
    rules: PricingRule[];
}
export interface PricingRule {
    id: string;
    code?: string | undefined;
    name: string;
    active: boolean;
    priority: number;
    ruleType: RuleType;
    valueType: ValueType;
    value: number;
    combinable: boolean;
    validFrom?: Timestamp | undefined;
    validTo?: Timestamp | undefined;
    scopes: PricingRuleScopeInput[];
    conditions: PricingRuleConditionInput[];
}
export interface CreatePromoCodeRequest {
    code: string;
    ruleId: string;
    unlimited: boolean;
    usageLimit?: number | undefined;
    validFrom?: Timestamp | undefined;
    validTo?: Timestamp | undefined;
    /** Бонусные баллы лояльности за ввод промокода (копейки). */
    bonusPoints?: number | undefined;
}
export interface DeactivatePromoCodeRequest {
    code: string;
}
export interface PromoCode {
    id: string;
    code: string;
    ruleId: string;
    active: boolean;
    unlimited: boolean;
    usageLimit?: number | undefined;
    usedCount: number;
    validFrom?: Timestamp | undefined;
    validTo?: Timestamp | undefined;
    bonusPoints: number;
}
export interface CreateAudienceRequest {
    code: string;
    title: string;
    /**
     * 2026-09-22: публичное (для покупателя) название — пусто = показывать
     * title. Плюс необязательная привязка к событию/группе событий — пусто
     * в обоих = аудитория доступна на всех событиях (как раньше).
     */
    publicTitle?: string | undefined;
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface UpdateAudienceRequest {
    id: string;
    title?: string | undefined;
    /**
     * Как SetOrganizerRuleRequest.clear_earn_percent (loyalty.proto) — plain
     * optional не отличает "не трогать" от "очистить в null", для полей,
     * которые можно осознанно вернуть к global/дефолту, нужен явный флаг.
     */
    publicTitle?: string | undefined;
    clearPublicTitle: boolean;
    eventId?: string | undefined;
    clearEventId: boolean;
    eventGroupId?: string | undefined;
    clearEventGroupId: boolean;
}
export interface DeleteAudienceRequest {
    id: string;
}
export interface ListAudiencesRequest {
    /**
     * Фильтр по доступности на конкретном событии/группе — пусто = все.
     * Отдаёт аудитории БЕЗ event_id/event_group_id (глобальные) + аудитории
     * конкретно этого события/группы.
     */
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface ListAudiencesResponse {
    audiences: Audience[];
}
export interface Audience {
    id: string;
    code: string;
    title: string;
    publicTitle?: string | undefined;
    eventId?: string | undefined;
    eventGroupId?: string | undefined;
}
export interface DeleteResponse {
    ok: boolean;
}
export declare const PRICING_V1_PACKAGE_NAME = "pricing.v1";
export interface PricingServiceClient {
    /**
     * Главный метод сервиса — расчёт итоговой цены билета с учётом базовой
     * цены сектора, индивидуального оверрайда места, применимых правил
     * (скидки/наценки/фиксированная цена) и промокода. Результат расчёта
     * сохраняется как PriceSnapshot (аудит) — snapshot_id возвращается
     * в ответе и в дальнейшем передаётся в booking-service при создании
     * билета.
     */
    calculatePrice(request: CalculatePriceRequest): Observable<CalculatePriceResponse>;
    /**
     * Пакетный расчёт цены нескольких билетов одного заказа (booking-service
     * при бронировании на несколько мест — вместо N поштучных CalculatePrice).
     * Для каждого элемента создаётся собственный PriceSnapshot. Результаты
     * возвращаются в том же порядке, что и items.
     */
    calculatePrices(request: CalculatePricesRequest): Observable<CalculatePricesResponse>;
    /** Базовая цена сектора на конкретный сеанс */
    setPriceTemplate(request: SetPriceTemplateRequest): Observable<PriceTemplate>;
    getPriceTemplate(request: GetPriceTemplateRequest): Observable<PriceTemplate>;
    /** Все базовые цены секторов на конкретный сеанс (для витрины/схемы зала) */
    listPriceTemplates(request: ListPriceTemplatesRequest): Observable<ListPriceTemplatesResponse>;
    /** Индивидуальная цена конкретного места на конкретный сеанс */
    setSeatPriceOverride(request: SetSeatPriceOverrideRequest): Observable<SeatPriceOverride>;
    deleteSeatPriceOverride(request: DeleteSeatPriceOverrideRequest): Observable<DeleteResponse>;
    /**
     * Правила ценообразования (скидки/наценки/фикс. цена + область
     * действия + условия применения)
     */
    createPricingRule(request: CreatePricingRuleRequest): Observable<PricingRule>;
    updatePricingRule(request: UpdatePricingRuleRequest): Observable<PricingRule>;
    deletePricingRule(request: DeletePricingRuleRequest): Observable<DeleteResponse>;
    listPricingRules(request: ListPricingRulesRequest): Observable<ListPricingRulesResponse>;
    /** Промокоды */
    createPromoCode(request: CreatePromoCodeRequest): Observable<PromoCode>;
    deactivatePromoCode(request: DeactivatePromoCodeRequest): Observable<PromoCode>;
    /** Аудитории (категории покупателей — студент, пенсионер и т.п.) */
    createAudience(request: CreateAudienceRequest): Observable<Audience>;
    updateAudience(request: UpdateAudienceRequest): Observable<Audience>;
    deleteAudience(request: DeleteAudienceRequest): Observable<DeleteResponse>;
    listAudiences(request: ListAudiencesRequest): Observable<ListAudiencesResponse>;
}
export interface PricingServiceController {
    /**
     * Главный метод сервиса — расчёт итоговой цены билета с учётом базовой
     * цены сектора, индивидуального оверрайда места, применимых правил
     * (скидки/наценки/фиксированная цена) и промокода. Результат расчёта
     * сохраняется как PriceSnapshot (аудит) — snapshot_id возвращается
     * в ответе и в дальнейшем передаётся в booking-service при создании
     * билета.
     */
    calculatePrice(request: CalculatePriceRequest): Promise<CalculatePriceResponse> | Observable<CalculatePriceResponse> | CalculatePriceResponse;
    /**
     * Пакетный расчёт цены нескольких билетов одного заказа (booking-service
     * при бронировании на несколько мест — вместо N поштучных CalculatePrice).
     * Для каждого элемента создаётся собственный PriceSnapshot. Результаты
     * возвращаются в том же порядке, что и items.
     */
    calculatePrices(request: CalculatePricesRequest): Promise<CalculatePricesResponse> | Observable<CalculatePricesResponse> | CalculatePricesResponse;
    /** Базовая цена сектора на конкретный сеанс */
    setPriceTemplate(request: SetPriceTemplateRequest): Promise<PriceTemplate> | Observable<PriceTemplate> | PriceTemplate;
    getPriceTemplate(request: GetPriceTemplateRequest): Promise<PriceTemplate> | Observable<PriceTemplate> | PriceTemplate;
    /** Все базовые цены секторов на конкретный сеанс (для витрины/схемы зала) */
    listPriceTemplates(request: ListPriceTemplatesRequest): Promise<ListPriceTemplatesResponse> | Observable<ListPriceTemplatesResponse> | ListPriceTemplatesResponse;
    /** Индивидуальная цена конкретного места на конкретный сеанс */
    setSeatPriceOverride(request: SetSeatPriceOverrideRequest): Promise<SeatPriceOverride> | Observable<SeatPriceOverride> | SeatPriceOverride;
    deleteSeatPriceOverride(request: DeleteSeatPriceOverrideRequest): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
    /**
     * Правила ценообразования (скидки/наценки/фикс. цена + область
     * действия + условия применения)
     */
    createPricingRule(request: CreatePricingRuleRequest): Promise<PricingRule> | Observable<PricingRule> | PricingRule;
    updatePricingRule(request: UpdatePricingRuleRequest): Promise<PricingRule> | Observable<PricingRule> | PricingRule;
    deletePricingRule(request: DeletePricingRuleRequest): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
    listPricingRules(request: ListPricingRulesRequest): Promise<ListPricingRulesResponse> | Observable<ListPricingRulesResponse> | ListPricingRulesResponse;
    /** Промокоды */
    createPromoCode(request: CreatePromoCodeRequest): Promise<PromoCode> | Observable<PromoCode> | PromoCode;
    deactivatePromoCode(request: DeactivatePromoCodeRequest): Promise<PromoCode> | Observable<PromoCode> | PromoCode;
    /** Аудитории (категории покупателей — студент, пенсионер и т.п.) */
    createAudience(request: CreateAudienceRequest): Promise<Audience> | Observable<Audience> | Audience;
    updateAudience(request: UpdateAudienceRequest): Promise<Audience> | Observable<Audience> | Audience;
    deleteAudience(request: DeleteAudienceRequest): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
    listAudiences(request: ListAudiencesRequest): Promise<ListAudiencesResponse> | Observable<ListAudiencesResponse> | ListAudiencesResponse;
}
export declare function PricingServiceControllerMethods(): (constructor: Function) => void;
export declare const PRICING_SERVICE_NAME = "PricingService";
