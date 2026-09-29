import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "auth.v1";
/**
 * Запрос на отправку OTP.
 * identifier — email или телефон.
 * type — тип идентификатора (например, "email" или "phone").
 */
export interface SendOtpRequest {
    identifier: string;
    type: string;
    /**
     * 3.63.0: закон РБ «О защите персональных данных» — согласие на
     * обработку обязано быть явным и осознанным действием пользователя, а
     * не подразумеваться отправкой формы. Аккаунт (с телефоном/email)
     * создаётся уже здесь, в SendOtp, а не в VerifyOtp — поэтому и согласие
     * фиксируется здесь: на момент первой записи персональных данных в БД.
     * AuthService.sendOtp отклоняет запрос, если false.
     */
    consentAccepted: boolean;
    /**
     * 3.64.0: отдельное, необязательное согласие на рекламную рассылку
     * (акции/бонусы/спецпредложения) — в отличие от consent_accepted, НЕ
     * блокирует SendOtp: маркетинговое согласие по своей природе не может
     * быть условием оказания услуги, иначе оно не «свободное». Хранится тем
     * же append-only журналом (ConsentRecord), что и privacy, но под
     * doc_type="marketing" — отзывается независимо в личном кабинете.
     */
    marketingAccepted: boolean;
}
/**
 * Ответ на отправку OTP.
 * ok — true, если отправка прошла успешно.
 */
export interface SendOtpResponse {
    ok: boolean;
}
export interface VerifyOtpRequest {
    identifier: string;
    type: string;
    code: string;
}
export interface VerifyOtpResponse {
    accessToken: string;
    refreshToken: string;
}
export interface RefreshRequest {
    refreshToken: string;
}
export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}
export interface TelegramInitResponse {
    url: string;
}
/** лучше указать реальные поля, которые передает telegram */
export interface TelegramVerifyRequest {
    query: {
        [key: string]: string;
    };
}
export interface TelegramVerifyRequest_QueryEntry {
    key: string;
    value: string;
}
export interface TelegramVerifyResponse {
    url?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
}
export interface TelegramCompleteRequest {
    sessionId: string;
    phone: string;
}
export interface TelegramCompleteResponse {
    sessionId: string;
}
export interface TelegramConsumeRequest {
    sessionId: string;
}
export interface TelegramConsumeResponse {
    accessToken: string;
    refreshToken: string;
}
export declare const AUTH_V1_PACKAGE_NAME = "auth.v1";
/**
 * AuthService отвечает за операции аутентификации.
 * В данном случае — отправку одноразового пароля (OTP).
 */
export interface AuthServiceClient {
    /**
     * SendOtp отправляет одноразовый пароль (OTP) на указанный идентификатор.
     * Может быть email, телефон или другой тип.
     */
    sendOtp(request: SendOtpRequest): Observable<SendOtpResponse>;
    /**
     * VerifyOtp верифицирует одноразовый пароль.
     * отправляет токены.
     */
    verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse>;
    /** Refresh обновляет токен. */
    refresh(request: RefreshRequest): Observable<RefreshResponse>;
    /** TelegramInit - генерация url для авторизации в telegram. */
    telegramInit(request: Empty): Observable<TelegramInitResponse>;
    /** TelegramInit - генерация url для авторизации в telegram. */
    telegramVerify(request: TelegramVerifyRequest): Observable<TelegramVerifyResponse>;
    /**
     * TelegramComplete вызывает телеграм бот
     * пользователь передает sessionId и номер телефона
     */
    telegramComplete(request: TelegramCompleteRequest): Observable<TelegramCompleteResponse>;
    /**
     * TelegramConsume вызывает gateway
     * отдает пару токенов
     */
    telegramConsume(request: TelegramConsumeRequest): Observable<TelegramConsumeResponse>;
}
/**
 * AuthService отвечает за операции аутентификации.
 * В данном случае — отправку одноразового пароля (OTP).
 */
export interface AuthServiceController {
    /**
     * SendOtp отправляет одноразовый пароль (OTP) на указанный идентификатор.
     * Может быть email, телефон или другой тип.
     */
    sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> | Observable<SendOtpResponse> | SendOtpResponse;
    /**
     * VerifyOtp верифицирует одноразовый пароль.
     * отправляет токены.
     */
    verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> | Observable<VerifyOtpResponse> | VerifyOtpResponse;
    /** Refresh обновляет токен. */
    refresh(request: RefreshRequest): Promise<RefreshResponse> | Observable<RefreshResponse> | RefreshResponse;
    /** TelegramInit - генерация url для авторизации в telegram. */
    telegramInit(request: Empty): Promise<TelegramInitResponse> | Observable<TelegramInitResponse> | TelegramInitResponse;
    /** TelegramInit - генерация url для авторизации в telegram. */
    telegramVerify(request: TelegramVerifyRequest): Promise<TelegramVerifyResponse> | Observable<TelegramVerifyResponse> | TelegramVerifyResponse;
    /**
     * TelegramComplete вызывает телеграм бот
     * пользователь передает sessionId и номер телефона
     */
    telegramComplete(request: TelegramCompleteRequest): Promise<TelegramCompleteResponse> | Observable<TelegramCompleteResponse> | TelegramCompleteResponse;
    /**
     * TelegramConsume вызывает gateway
     * отдает пару токенов
     */
    telegramConsume(request: TelegramConsumeRequest): Promise<TelegramConsumeResponse> | Observable<TelegramConsumeResponse> | TelegramConsumeResponse;
}
export declare function AuthServiceControllerMethods(): (constructor: Function) => void;
export declare const AUTH_SERVICE_NAME = "AuthService";
