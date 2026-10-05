import { Observable } from "rxjs";
export declare const protobufPackage = "content.v1";
export interface ContentEntry {
    key: string;
    value: string;
}
export interface ListContentRequest {
}
export interface ListContentResponse {
    entries: ContentEntry[];
}
export interface SetContentRequest {
    entries: ContentEntry[];
}
export interface SetContentResponse {
    ok: boolean;
}
export interface LayoutBlock {
    /**
     * Ключ блока (например "hero"/"popular"/"news") — платформа его не
     * интерпретирует, просто хранит порядок и видимость.
     */
    key: string;
    visible: boolean;
}
export interface GetPageLayoutRequest {
    /** "home" | "event" | ... — любой ключ страницы, сервис не валидирует. */
    page: string;
}
export interface GetPageLayoutResponse {
    /**
     * Порядок массива — порядок отображения. Пусто — переопределения нет,
     * фронт использует дефолтную вёрстку страницы.
     */
    blocks: LayoutBlock[];
    isOverride: boolean;
}
export interface SetPageLayoutRequest {
    page: string;
    blocks: LayoutBlock[];
}
export interface SetPageLayoutResponse {
    ok: boolean;
}
export interface FooterLink {
    label: string;
    url: string;
}
export interface FooterColumn {
    title: string;
    links: FooterLink[];
}
export interface GetFooterMenuRequest {
}
export interface GetFooterMenuResponse {
    /**
     * Порядок массива — порядок отображения колонок; порядок links внутри
     * колонки — порядок отображения ссылок. Пусто — переопределения нет.
     */
    columns: FooterColumn[];
    isOverride: boolean;
}
export interface SetFooterMenuRequest {
    columns: FooterColumn[];
}
export interface SetFooterMenuResponse {
    ok: boolean;
}
export declare const CONTENT_V1_PACKAGE_NAME = "content.v1";
/**
 * 3.26.0: редактируемые в админке заголовки блоков публичной части (шапка,
 * футер, заголовки секций страниц). Плоский словарь key -> value; хранится
 * только то, что реально переопределено — дефолты живут на фронте
 * (`shared/config/site-content.ts`), сервис ничего не знает про их смысл.
 * Живёт в event-service (уже владеет общедоступным контентом каталога,
 * заводить отдельный сервис ради одной таблицы избыточно).
 *
 * 4.1.0: single-organizer — organizer_id убран из всех запросов.
 * Данные хранятся с организатором '' (платформенный дефолт), merge-логика
 * удалена.
 */
export interface ContentServiceClient {
    /** Публично, без авторизации — читает вся публичная часть сайта. */
    listContent(request: ListContentRequest): Observable<ListContentResponse>;
    /**
     * ADMIN. Батч: несколько ключей одной формой. Пустое value — удалить
     * переопределение (вернуться к дефолту на фронте).
     */
    setContent(request: SetContentRequest): Observable<SetContentResponse>;
    /**
     * 3.27.0: порядок и видимость секций страницы (`home`/`event`) — гибкая
     * вёрстка без правки кода. Набор доступных блоков и их дефолтный порядок
     * знает только фронтенд (`shared/config/page-layout.ts`); сервис хранит
     * только то, что реально переопределено (как и ContentEntry).
     */
    getPageLayout(request: GetPageLayoutRequest): Observable<GetPageLayoutResponse>;
    /**
     * ADMIN. Пустой blocks[] — удалить переопределение (вернуться к дефолтной
     * вёрстке страницы).
     */
    setPageLayout(request: SetPageLayoutRequest): Observable<SetPageLayoutResponse>;
    /** 3.51.0: колонки меню футера (заголовок + список ссылок). */
    getFooterMenu(request: GetFooterMenuRequest): Observable<GetFooterMenuResponse>;
    /**
     * ADMIN. Пустой columns[] — удалить переопределение (вернуться к
     * платформенным колонкам футера).
     */
    setFooterMenu(request: SetFooterMenuRequest): Observable<SetFooterMenuResponse>;
}
/**
 * 3.26.0: редактируемые в админке заголовки блоков публичной части (шапка,
 * футер, заголовки секций страниц). Плоский словарь key -> value; хранится
 * только то, что реально переопределено — дефолты живут на фронте
 * (`shared/config/site-content.ts`), сервис ничего не знает про их смысл.
 * Живёт в event-service (уже владеет общедоступным контентом каталога,
 * заводить отдельный сервис ради одной таблицы избыточно).
 *
 * 4.1.0: single-organizer — organizer_id убран из всех запросов.
 * Данные хранятся с организатором '' (платформенный дефолт), merge-логика
 * удалена.
 */
export interface ContentServiceController {
    /** Публично, без авторизации — читает вся публичная часть сайта. */
    listContent(request: ListContentRequest): Promise<ListContentResponse> | Observable<ListContentResponse> | ListContentResponse;
    /**
     * ADMIN. Батч: несколько ключей одной формой. Пустое value — удалить
     * переопределение (вернуться к дефолту на фронте).
     */
    setContent(request: SetContentRequest): Promise<SetContentResponse> | Observable<SetContentResponse> | SetContentResponse;
    /**
     * 3.27.0: порядок и видимость секций страницы (`home`/`event`) — гибкая
     * вёрстка без правки кода. Набор доступных блоков и их дефолтный порядок
     * знает только фронтенд (`shared/config/page-layout.ts`); сервис хранит
     * только то, что реально переопределено (как и ContentEntry).
     */
    getPageLayout(request: GetPageLayoutRequest): Promise<GetPageLayoutResponse> | Observable<GetPageLayoutResponse> | GetPageLayoutResponse;
    /**
     * ADMIN. Пустой blocks[] — удалить переопределение (вернуться к дефолтной
     * вёрстке страницы).
     */
    setPageLayout(request: SetPageLayoutRequest): Promise<SetPageLayoutResponse> | Observable<SetPageLayoutResponse> | SetPageLayoutResponse;
    /** 3.51.0: колонки меню футера (заголовок + список ссылок). */
    getFooterMenu(request: GetFooterMenuRequest): Promise<GetFooterMenuResponse> | Observable<GetFooterMenuResponse> | GetFooterMenuResponse;
    /**
     * ADMIN. Пустой columns[] — удалить переопределение (вернуться к
     * платформенным колонкам футера).
     */
    setFooterMenu(request: SetFooterMenuRequest): Promise<SetFooterMenuResponse> | Observable<SetFooterMenuResponse> | SetFooterMenuResponse;
}
export declare function ContentServiceControllerMethods(): (constructor: Function) => void;
export declare const CONTENT_SERVICE_NAME = "ContentService";
