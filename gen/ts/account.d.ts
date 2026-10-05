import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
import { Timestamp } from "./google/protobuf/timestamp";
export declare const protobufPackage = "account.v1";
export interface GetAccountRequest {
    id: string;
}
export interface GetAccountResponse {
    id: string;
    phone: string;
    email: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    /**
     * Ключ роли из справочной таблицы `roles` в auth-service
     * (USER | ADMIN | EDITOR | CASHIER). Раньше было enum Role — заменено на
     * string, т.к. роли вынесены в таблицу. Канонический список ключей —
     * `ROLE_KEYS` в @usteam/common.
     */
    role: string;
}
export interface ListAccountsRequest {
    /** Поиск по подстроке в phone/email */
    query?: string | undefined;
    /** Фильтр по ключу роли */
    role?: string | undefined;
    page: number;
    pageSize: number;
}
export interface ListAccountsResponse {
    accounts: GetAccountResponse[];
    total: number;
}
export interface SetAccountRoleRequest {
    id: string;
    /** Ключ роли (USER | ADMIN | EDITOR | CASHIER) */
    role: string;
}
export interface Role {
    id: string;
    key: string;
    title: string;
}
export interface ListRolesResponse {
    roles: Role[];
}
export interface InitEmailChangeRequest {
    email: string;
    userId: string;
}
export interface InitEmailChangeResponse {
    ok: boolean;
}
export interface ConfirmEmailChangeRequest {
    email: string;
    code: string;
    userId: string;
}
export interface ConfirmEmailChangeResponse {
    ok: boolean;
}
export interface InitPhoneChangeRequest {
    phone: string;
    userId: string;
}
export interface InitPhoneChangeResponse {
    ok: boolean;
}
export interface ConfirmPhoneChangeRequest {
    phone: string;
    code: string;
    userId: string;
}
export interface ConfirmPhoneChangeResponse {
    ok: boolean;
}
/**
 * doc_type — открытая строка (как NewsArticle.scope в news.proto), не enum:
 * платформа сегодня знает только "privacy" (единый документ, объединяющий
 * политику обработки и раздел про cookie — так это оформлено на практике
 * большинством площадок в РБ), но формат не завязан на единственное
 * значение.
 */
export interface GetLegalDocumentRequest {
    docType: string;
}
export interface LegalDocument {
    docType: string;
    title: string;
    body: string;
    /**
     * Монотонно растёт на каждый SetLegalDocument — на неё ссылаются записи
     * согласия (ConsentEntry.version), поэтому клиент её не задаёт.
     */
    version: number;
    updatedAt: Timestamp | undefined;
}
export interface GetLegalDocumentResponse {
    document: LegalDocument | undefined;
}
export interface SetLegalDocumentRequest {
    docType: string;
    title: string;
    body: string;
}
export interface GetConsentStatusRequest {
    accountId: string;
    docType: string;
}
export interface ConsentStatus {
    /**
     * true — последняя запись в журнале этого account_id/doc_type — GIVEN
     * более поздняя, чем любой WITHDRAWN.
     */
    given: boolean;
    /**
     * Версия документа, на которую дано ныне действующее согласие (0, если
     * given=false или согласия не было вовсе).
     */
    version: number;
    givenAt?: Timestamp | undefined;
    withdrawnAt?: Timestamp | undefined;
    /**
     * Версия документа, актуальная ПРЯМО СЕЙЧАС — позволяет вызывающей
     * стороне понять, что согласие устарело (given=true, но version <
     * current_doc_version), не делая отдельный запрос GetLegalDocument.
     */
    currentDocVersion: number;
}
export interface GetConsentStatusResponse {
    status: ConsentStatus | undefined;
}
export interface GiveConsentRequest {
    accountId: string;
    docType: string;
}
export interface WithdrawConsentRequest {
    accountId: string;
    docType: string;
}
export interface ListConsentHistoryRequest {
    accountId: string;
}
export interface ConsentEntry {
    docType: string;
    version: number;
    /**
     * "GIVEN" | "WITHDRAWN" — строка, не enum: тот же принцип wire-безопасности,
     * что и у doc_type/NewsArticle.scope (см. COMMON.md).
     */
    action: string;
    createdAt: Timestamp | undefined;
}
export interface ListConsentHistoryResponse {
    entries: ConsentEntry[];
}
export declare const ACCOUNT_V1_PACKAGE_NAME = "account.v1";
/** AccountService отвечает за операции с аккаунтом. */
export interface AccountServiceClient {
    /**
     * GetAccount отправляет id аккаунта
     * получает данные об аккаунте
     */
    getAccount(request: GetAccountRequest): Observable<GetAccountResponse>;
    /** Администрирование аккаунтов и ролей */
    listAccounts(request: ListAccountsRequest): Observable<ListAccountsResponse>;
    setAccountRole(request: SetAccountRoleRequest): Observable<GetAccountResponse>;
    listRoles(request: Empty): Observable<ListRolesResponse>;
    /** InitEmailChange запрашивает новую почту */
    initEmailChange(request: InitEmailChangeRequest): Observable<InitEmailChangeResponse>;
    /** ConfirmEmailChange подтверждает новую почту */
    confirmEmailChange(request: ConfirmEmailChangeRequest): Observable<ConfirmEmailChangeResponse>;
    /** InitPhoneChange запрашивает новый телефон */
    initPhoneChange(request: InitPhoneChangeRequest): Observable<InitPhoneChangeResponse>;
    /** ConfirmPhoneChange подтверждает новый телефон */
    confirmPhoneChange(request: ConfirmPhoneChangeRequest): Observable<ConfirmPhoneChangeResponse>;
    /**
     * 3.63.0: закон РБ «О защите персональных данных» — публичный документ
     * политики обработки + журнал согласий аккаунта (append-only, как
     * loyalty-ledger — согласие/отзыв не перезаписываются, а добавляются
     * новой строкой, чтобы история была проверяемой).
     *
     * Публично, без авторизации — читает вся публичная часть сайта, как
     * ListContent в content.proto.
     */
    getLegalDocument(request: GetLegalDocumentRequest): Observable<GetLegalDocumentResponse>;
    /**
     * ADMIN. Версия НЕ принимается от вызывающей стороны — только
     * авто-инкремент на сервере: версия обязана быть неподделываемой,
     * на неё ссылаются уже данные согласия аккаунтов.
     */
    setLegalDocument(request: SetLegalDocumentRequest): Observable<GetLegalDocumentResponse>;
    /** Текущий статус согласия аккаунта (для страницы «Мои данные»). */
    getConsentStatus(request: GetConsentStatusRequest): Observable<GetConsentStatusResponse>;
    /**
     * Явное (повторное) согласие — например, после обновления версии
     * документа. Идемпотентно: если согласие на эту версию уже дано, новая
     * строка не пишется.
     */
    giveConsent(request: GiveConsentRequest): Observable<GetConsentStatusResponse>;
    /**
     * Отзыв согласия — тем же способом, каким оно давалось (кнопка в
     * аккаунте), как того требует закон. Не удаляет аккаунт и не трогает
     * уже собранные данные (сроки хранения которых определяются отдельно,
     * напр. бухгалтерским/налоговым учётом уже совершённых заказов) — только
     * фиксирует отзыв в журнале; дальнейший вход (SendOtp) потребует
     * согласия заново.
     */
    withdrawConsent(request: WithdrawConsentRequest): Observable<GetConsentStatusResponse>;
    /**
     * Полная история согласий/отзывов аккаунта — реализация права
     * «запросить информацию об обработке своих данных».
     */
    listConsentHistory(request: ListConsentHistoryRequest): Observable<ListConsentHistoryResponse>;
}
/** AccountService отвечает за операции с аккаунтом. */
export interface AccountServiceController {
    /**
     * GetAccount отправляет id аккаунта
     * получает данные об аккаунте
     */
    getAccount(request: GetAccountRequest): Promise<GetAccountResponse> | Observable<GetAccountResponse> | GetAccountResponse;
    /** Администрирование аккаунтов и ролей */
    listAccounts(request: ListAccountsRequest): Promise<ListAccountsResponse> | Observable<ListAccountsResponse> | ListAccountsResponse;
    setAccountRole(request: SetAccountRoleRequest): Promise<GetAccountResponse> | Observable<GetAccountResponse> | GetAccountResponse;
    listRoles(request: Empty): Promise<ListRolesResponse> | Observable<ListRolesResponse> | ListRolesResponse;
    /** InitEmailChange запрашивает новую почту */
    initEmailChange(request: InitEmailChangeRequest): Promise<InitEmailChangeResponse> | Observable<InitEmailChangeResponse> | InitEmailChangeResponse;
    /** ConfirmEmailChange подтверждает новую почту */
    confirmEmailChange(request: ConfirmEmailChangeRequest): Promise<ConfirmEmailChangeResponse> | Observable<ConfirmEmailChangeResponse> | ConfirmEmailChangeResponse;
    /** InitPhoneChange запрашивает новый телефон */
    initPhoneChange(request: InitPhoneChangeRequest): Promise<InitPhoneChangeResponse> | Observable<InitPhoneChangeResponse> | InitPhoneChangeResponse;
    /** ConfirmPhoneChange подтверждает новый телефон */
    confirmPhoneChange(request: ConfirmPhoneChangeRequest): Promise<ConfirmPhoneChangeResponse> | Observable<ConfirmPhoneChangeResponse> | ConfirmPhoneChangeResponse;
    /**
     * 3.63.0: закон РБ «О защите персональных данных» — публичный документ
     * политики обработки + журнал согласий аккаунта (append-only, как
     * loyalty-ledger — согласие/отзыв не перезаписываются, а добавляются
     * новой строкой, чтобы история была проверяемой).
     *
     * Публично, без авторизации — читает вся публичная часть сайта, как
     * ListContent в content.proto.
     */
    getLegalDocument(request: GetLegalDocumentRequest): Promise<GetLegalDocumentResponse> | Observable<GetLegalDocumentResponse> | GetLegalDocumentResponse;
    /**
     * ADMIN. Версия НЕ принимается от вызывающей стороны — только
     * авто-инкремент на сервере: версия обязана быть неподделываемой,
     * на неё ссылаются уже данные согласия аккаунтов.
     */
    setLegalDocument(request: SetLegalDocumentRequest): Promise<GetLegalDocumentResponse> | Observable<GetLegalDocumentResponse> | GetLegalDocumentResponse;
    /** Текущий статус согласия аккаунта (для страницы «Мои данные»). */
    getConsentStatus(request: GetConsentStatusRequest): Promise<GetConsentStatusResponse> | Observable<GetConsentStatusResponse> | GetConsentStatusResponse;
    /**
     * Явное (повторное) согласие — например, после обновления версии
     * документа. Идемпотентно: если согласие на эту версию уже дано, новая
     * строка не пишется.
     */
    giveConsent(request: GiveConsentRequest): Promise<GetConsentStatusResponse> | Observable<GetConsentStatusResponse> | GetConsentStatusResponse;
    /**
     * Отзыв согласия — тем же способом, каким оно давалось (кнопка в
     * аккаунте), как того требует закон. Не удаляет аккаунт и не трогает
     * уже собранные данные (сроки хранения которых определяются отдельно,
     * напр. бухгалтерским/налоговым учётом уже совершённых заказов) — только
     * фиксирует отзыв в журнале; дальнейший вход (SendOtp) потребует
     * согласия заново.
     */
    withdrawConsent(request: WithdrawConsentRequest): Promise<GetConsentStatusResponse> | Observable<GetConsentStatusResponse> | GetConsentStatusResponse;
    /**
     * Полная история согласий/отзывов аккаунта — реализация права
     * «запросить информацию об обработке своих данных».
     */
    listConsentHistory(request: ListConsentHistoryRequest): Promise<ListConsentHistoryResponse> | Observable<ListConsentHistoryResponse> | ListConsentHistoryResponse;
}
export declare function AccountServiceControllerMethods(): (constructor: Function) => void;
export declare const ACCOUNT_SERVICE_NAME = "AccountService";
