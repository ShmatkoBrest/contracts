import { Observable } from "rxjs";
export declare const protobufPackage = "city.v1";
export interface City {
    id: string;
    /**
     * Уникальный человекочитаемый ключ (`brest`, `minsk`) — на него
     * ссылается event-service и фронтенд в URL.
     */
    slug: string;
    name: string;
    /** Координаты центра города (для карт/сортировки по близости) — опционально. */
    lat?: number | undefined;
    lng?: number | undefined;
    /** Порядок в списке (меньше — выше). */
    sortOrder: number;
}
export interface ListCitiesRequest {
}
export interface ListCitiesResponse {
    cities: City[];
}
export interface GetCityRequest {
    id?: string | undefined;
    slug?: string | undefined;
}
export interface GetCityResponse {
    city: City | undefined;
}
export interface CreateCityRequest {
    slug: string;
    name: string;
    lat?: number | undefined;
    lng?: number | undefined;
    sortOrder?: number | undefined;
}
export interface UpdateCityRequest {
    id: string;
    slug?: string | undefined;
    name?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    sortOrder?: number | undefined;
}
export interface CityResponse {
    city: City | undefined;
}
export interface DeleteCityRequest {
    id: string;
}
export interface DeleteCityResponse {
    ok: boolean;
}
export declare const CITY_V1_PACKAGE_NAME = "city.v1";
/**
 * Справочник городов платформы. Живёт в arena-service (арены физически
 * находятся в городах; конструктор зала привязывает арену к городу).
 * event-service ссылается на город по slug-строке (поле Event.place),
 * без кросс-сервисного FK.
 */
export interface CityServiceClient {
    /** Список всех городов (для афиши и конструктора). */
    listCities(request: ListCitiesRequest): Observable<ListCitiesResponse>;
    /** Город по id или slug. */
    getCity(request: GetCityRequest): Observable<GetCityResponse>;
    createCity(request: CreateCityRequest): Observable<CityResponse>;
    updateCity(request: UpdateCityRequest): Observable<CityResponse>;
    deleteCity(request: DeleteCityRequest): Observable<DeleteCityResponse>;
}
/**
 * Справочник городов платформы. Живёт в arena-service (арены физически
 * находятся в городах; конструктор зала привязывает арену к городу).
 * event-service ссылается на город по slug-строке (поле Event.place),
 * без кросс-сервисного FK.
 */
export interface CityServiceController {
    /** Список всех городов (для афиши и конструктора). */
    listCities(request: ListCitiesRequest): Promise<ListCitiesResponse> | Observable<ListCitiesResponse> | ListCitiesResponse;
    /** Город по id или slug. */
    getCity(request: GetCityRequest): Promise<GetCityResponse> | Observable<GetCityResponse> | GetCityResponse;
    createCity(request: CreateCityRequest): Promise<CityResponse> | Observable<CityResponse> | CityResponse;
    updateCity(request: UpdateCityRequest): Promise<CityResponse> | Observable<CityResponse> | CityResponse;
    deleteCity(request: DeleteCityRequest): Promise<DeleteCityResponse> | Observable<DeleteCityResponse> | DeleteCityResponse;
}
export declare function CityServiceControllerMethods(): (constructor: Function) => void;
export declare const CITY_SERVICE_NAME = "CityService";
