import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "organizer.v1";
export interface ListOrganizersResponse {
    organizers: Organizer[];
}
export interface GetOrganizerRequest {
    id: string;
}
export interface GetOrganizerResponse {
    organizer: Organizer | undefined;
}
export interface Organizer {
    id: string;
    title: string;
    description: string;
    image: string;
}
export interface GetOrganizerLicenseRequest {
    organizerId: string;
}
export interface GetOrganizerLicenseResponse {
    organizerId: string;
    /** пусто — ключ ещё не выпущен */
    licenseKey: string;
    /** ACTIVE | TRIAL | REVOKED */
    licenseStatus: string;
    /** ISO-строка или "" */
    licenseExpiresAt: string;
}
export interface SetOrganizerLicenseRequest {
    organizerId: string;
    /** ACTIVE | TRIAL | REVOKED */
    status: string;
    /** ISO-строка, пусто = бессрочно */
    expiresAt: string;
    regenerateKey: boolean;
}
export interface SetOrganizerLicenseResponse {
    organizerId: string;
    licenseKey: string;
    licenseStatus: string;
    licenseExpiresAt: string;
}
export interface GetOrganizerCommissionRequest {
    organizerId: string;
}
export interface GetOrganizerCommissionResponse {
    organizerId: string;
    /** пусто / null — ставка не задана (используется платформенный дефолт) */
    commissionPercent?: number | undefined;
}
export interface SetOrganizerCommissionRequest {
    organizerId: string;
    commissionPercent?: number | undefined;
    /** true — убрать ставку (вернуться к дефолту) */
    clear: boolean;
}
export declare const ORGANIZER_V1_PACKAGE_NAME = "organizer.v1";
/** Сервис для работы с организаторами событий. */
export interface OrganizerServiceClient {
    listOrganizers(request: Empty): Observable<ListOrganizersResponse>;
    getOrganizer(request: GetOrganizerRequest): Observable<GetOrganizerResponse>;
    /** Лицензионный ключ (для развёртываний фронтенда на стороннем хостинге). */
    getOrganizerLicense(request: GetOrganizerLicenseRequest): Observable<GetOrganizerLicenseResponse>;
    setOrganizerLicense(request: SetOrganizerLicenseRequest): Observable<SetOrganizerLicenseResponse>;
    /** Ставка комиссии платформы для организатора (для отчёта и ручного выставления). */
    getOrganizerCommission(request: GetOrganizerCommissionRequest): Observable<GetOrganizerCommissionResponse>;
    setOrganizerCommission(request: SetOrganizerCommissionRequest): Observable<GetOrganizerCommissionResponse>;
}
/** Сервис для работы с организаторами событий. */
export interface OrganizerServiceController {
    listOrganizers(request: Empty): Promise<ListOrganizersResponse> | Observable<ListOrganizersResponse> | ListOrganizersResponse;
    getOrganizer(request: GetOrganizerRequest): Promise<GetOrganizerResponse> | Observable<GetOrganizerResponse> | GetOrganizerResponse;
    /** Лицензионный ключ (для развёртываний фронтенда на стороннем хостинге). */
    getOrganizerLicense(request: GetOrganizerLicenseRequest): Promise<GetOrganizerLicenseResponse> | Observable<GetOrganizerLicenseResponse> | GetOrganizerLicenseResponse;
    setOrganizerLicense(request: SetOrganizerLicenseRequest): Promise<SetOrganizerLicenseResponse> | Observable<SetOrganizerLicenseResponse> | SetOrganizerLicenseResponse;
    /** Ставка комиссии платформы для организатора (для отчёта и ручного выставления). */
    getOrganizerCommission(request: GetOrganizerCommissionRequest): Promise<GetOrganizerCommissionResponse> | Observable<GetOrganizerCommissionResponse> | GetOrganizerCommissionResponse;
    setOrganizerCommission(request: SetOrganizerCommissionRequest): Promise<GetOrganizerCommissionResponse> | Observable<GetOrganizerCommissionResponse> | GetOrganizerCommissionResponse;
}
export declare function OrganizerServiceControllerMethods(): (constructor: Function) => void;
export declare const ORGANIZER_SERVICE_NAME = "OrganizerService";
