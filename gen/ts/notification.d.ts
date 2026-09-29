import { Observable } from "rxjs";
export declare const protobufPackage = "notification.v1";
/**
 * SMS_ASSISTENT — исторический провайдер (sms-assistent.by). Его credentials
 * раньше жили только в переменных окружения SMS_USER/SMS_PASSWORD/SMS_SENDER/
 * SMS_BASE_URL — это остаётся рабочим фолбэком, пока в БД ни разу не
 * сохранялись настройки (см. SmsSettings.configured).
 */
export declare enum SmsProvider {
    SMS_PROVIDER_UNSPECIFIED = 0,
    SMS_ASSISTENT = 1,
    MTS = 2,
    UNRECOGNIZED = -1
}
export interface GetSmsSettingsRequest {
}
export interface SmsSettings {
    /**
     * false — в БД ещё нет сохранённой записи, платформа работает на
     * переменных окружения (исторический SMS_ASSISTENT). true — админ хотя
     * бы раз сохранил настройки через админку, они и определяют отправку.
     */
    configured: boolean;
    provider: SmsProvider;
    enabled: boolean;
    assistentBaseUrl: string;
    assistentUser: string;
    assistentPassword: string;
    assistentSender: string;
    /**
     * МТС «Коммуникатор», JSONv2 API — POST {base_url}/{client_id}/json2/simple,
     * HTTP Basic (login/password). phone_number передаётся в международном
     * формате без "+".
     */
    mtsBaseUrl: string;
    mtsClientId: string;
    mtsLogin: string;
    mtsPassword: string;
    /** Альфа-имя отправителя — согласовывается с МТС отдельно от учётки. */
    mtsAlphaName: string;
    /** TTL сообщения в секундах (МТС API): 40..86400. */
    mtsTtlSeconds: number;
}
export interface SetSmsSettingsRequest {
    provider: SmsProvider;
    enabled: boolean;
    assistentBaseUrl: string;
    assistentUser: string;
    /**
     * Не задано (proto3 "optional" — presence отслеживается) — не менять
     * сохранённый пароль; пришла пустая строка "" — явно очистить его.
     * Голое string здесь не подошло бы: wire-уровень не отличил бы
     * "не передано" от "передано пустое".
     */
    assistentPassword?: string | undefined;
    assistentSender: string;
    mtsBaseUrl: string;
    mtsClientId: string;
    mtsLogin: string;
    mtsPassword?: string | undefined;
    mtsAlphaName: string;
    mtsTtlSeconds: number;
}
export declare const NOTIFICATION_V1_PACKAGE_NAME = "notification.v1";
/**
 * Настройки отправки SMS (OTP, смена телефона) — платформенный уровень, не
 * per-organizer: единый шлюз уведомлений для всей платформы. Секреты живут
 * здесь, а не в content.v1 — ListContent там отдаётся ПУБЛИЧНО без
 * авторизации на каждой странице сайта, хранить в нём пароль от SMS-шлюза
 * означало бы отдавать его любому анонимному посетителю. Вызывается только
 * gateway-service (ADMIN-only на HTTP-уровне), собственной авторизации нет.
 */
export interface NotificationSettingsServiceClient {
    getSmsSettings(request: GetSmsSettingsRequest): Observable<SmsSettings>;
    setSmsSettings(request: SetSmsSettingsRequest): Observable<SmsSettings>;
}
/**
 * Настройки отправки SMS (OTP, смена телефона) — платформенный уровень, не
 * per-organizer: единый шлюз уведомлений для всей платформы. Секреты живут
 * здесь, а не в content.v1 — ListContent там отдаётся ПУБЛИЧНО без
 * авторизации на каждой странице сайта, хранить в нём пароль от SMS-шлюза
 * означало бы отдавать его любому анонимному посетителю. Вызывается только
 * gateway-service (ADMIN-only на HTTP-уровне), собственной авторизации нет.
 */
export interface NotificationSettingsServiceController {
    getSmsSettings(request: GetSmsSettingsRequest): Promise<SmsSettings> | Observable<SmsSettings> | SmsSettings;
    setSmsSettings(request: SetSmsSettingsRequest): Promise<SmsSettings> | Observable<SmsSettings> | SmsSettings;
}
export declare function NotificationSettingsServiceControllerMethods(): (constructor: Function) => void;
export declare const NOTIFICATION_SETTINGS_SERVICE_NAME = "NotificationSettingsService";
