import { Observable } from "rxjs";
export declare const protobufPackage = "site_builder.v1";
export interface UploadOverlayRequest {
    organizerId: string;
    zipData: Uint8Array;
}
export interface UploadOverlayResponse {
    accepted: boolean;
    /**
     * Конкретные пути, не прошедшие allow-list/защиту от zip-slip —
     * показывается организатору как есть, чтобы он понимал, что убрать.
     */
    rejectedPaths: string[];
    /**
     * Человекочитаемая причина отказа (архив пуст/битый/превышен лимит) —
     * пусто при accepted=true.
     */
    error: string;
}
export interface RebuildRequest {
    organizerId: string;
}
export interface RebuildResponse {
    accepted: boolean;
    /** "no overlay uploaded yet" и т.п. — пусто при accepted=true. */
    error: string;
}
export interface DownloadBuildRequest {
    organizerId: string;
}
export interface DownloadBuildResponse {
    found: boolean;
    zipData: Uint8Array;
}
export declare const SITE_BUILDER_V1_PACKAGE_NAME = "site_builder.v1";
/**
 * Сборка и раздача организаторских white-label сайтов (оверлей
 * презентационных файлов поверх core `frontend`, см. frontend/ALLOWED_PATHS.json).
 * Все методы — внутренние, вызываются только gateway-service (нет
 * собственной авторизации, доверяет вызывающей стороне).
 */
export interface SiteBuilderServiceClient {
    /**
     * Валидирует ZIP-оверлей организатора синхронно (быстро — только
     * распаковка и сверка путей с ALLOWED_PATHS.json) и, если он прошёл
     * проверку, сохраняет его и запускает сборку в фоне (не дожидается
     * окончания — `npm ci && npm run build` может идти десятки секунд).
     * Прогресс сборки (BUILDING -> SUCCESS/FAILED) site-builder репортит
     * сам через organizer.v1.RecordOrganizerSiteBuild.
     */
    uploadOverlay(request: UploadOverlayRequest): Observable<UploadOverlayResponse>;
    /**
     * Пересобирает ПОСЛЕДНИЙ сохранённый оверлей заново (например, после
     * обновления core платформы) — без нового аплоада, версия оверлея не
     * меняется. Тоже асинхронная (см. UploadOverlay).
     */
    rebuild(request: RebuildRequest): Observable<RebuildResponse>;
    /** Отдаёт последнюю успешную сборку ZIP'ом — «Скачать сборку» в админке. */
    downloadBuild(request: DownloadBuildRequest): Observable<DownloadBuildResponse>;
}
/**
 * Сборка и раздача организаторских white-label сайтов (оверлей
 * презентационных файлов поверх core `frontend`, см. frontend/ALLOWED_PATHS.json).
 * Все методы — внутренние, вызываются только gateway-service (нет
 * собственной авторизации, доверяет вызывающей стороне).
 */
export interface SiteBuilderServiceController {
    /**
     * Валидирует ZIP-оверлей организатора синхронно (быстро — только
     * распаковка и сверка путей с ALLOWED_PATHS.json) и, если он прошёл
     * проверку, сохраняет его и запускает сборку в фоне (не дожидается
     * окончания — `npm ci && npm run build` может идти десятки секунд).
     * Прогресс сборки (BUILDING -> SUCCESS/FAILED) site-builder репортит
     * сам через organizer.v1.RecordOrganizerSiteBuild.
     */
    uploadOverlay(request: UploadOverlayRequest): Promise<UploadOverlayResponse> | Observable<UploadOverlayResponse> | UploadOverlayResponse;
    /**
     * Пересобирает ПОСЛЕДНИЙ сохранённый оверлей заново (например, после
     * обновления core платформы) — без нового аплоада, версия оверлея не
     * меняется. Тоже асинхронная (см. UploadOverlay).
     */
    rebuild(request: RebuildRequest): Promise<RebuildResponse> | Observable<RebuildResponse> | RebuildResponse;
    /** Отдаёт последнюю успешную сборку ZIP'ом — «Скачать сборку» в админке. */
    downloadBuild(request: DownloadBuildRequest): Promise<DownloadBuildResponse> | Observable<DownloadBuildResponse> | DownloadBuildResponse;
}
export declare function SiteBuilderServiceControllerMethods(): (constructor: Function) => void;
export declare const SITE_BUILDER_SERVICE_NAME = "SiteBuilderService";
