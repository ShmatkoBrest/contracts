import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "arena.v1";
export interface ListArenasResponse {
    arenas: Arena[];
}
export interface GetArenaRequest {
    id: string;
}
export interface GetArenaResponse {
    arena: Arena | undefined;
}
export interface CreateArenaRequest {
    name: string;
    address: string;
    image: string;
    /** id города (city.v1, FK внутри arena-service). Опционально для обратной совместимости. */
    cityId?: string | undefined;
    /**
     * S3-ключ схемы зала (подложка конструктора, §12). Отличается от image
     * (фото площадки для карточек).
     */
    planImage?: string | undefined;
}
export interface CreateArenaResponse {
    arena: Arena | undefined;
}
export interface UpdateArenaRequest {
    id: string;
    name: string;
    address: string;
    image: string;
    cityId?: string | undefined;
    planImage?: string | undefined;
}
export interface UpdateArenaResponse {
    arena: Arena | undefined;
}
export interface DeleteArenaRequest {
    id: string;
}
export interface DeleteArenaResponse {
    ok: boolean;
}
export interface Arena {
    id: string;
    name: string;
    address: string;
    image: string;
    cityId?: string | undefined;
    /** slug города, денормализовано при чтении (для афиши/фронта без доп. запроса). */
    citySlug?: string | undefined;
    planImage?: string | undefined;
}
export declare const ARENA_V1_PACKAGE_NAME = "arena.v1";
export interface ArenaServiceClient {
    /** получение списка арен */
    listArenas(request: Empty): Observable<ListArenasResponse>;
    /** получение арены по id */
    getArena(request: GetArenaRequest): Observable<GetArenaResponse>;
    /** создание арены */
    createArena(request: CreateArenaRequest): Observable<CreateArenaResponse>;
    /** обновление арены */
    updateArena(request: UpdateArenaRequest): Observable<UpdateArenaResponse>;
    /** удаление арены */
    deleteArena(request: DeleteArenaRequest): Observable<DeleteArenaResponse>;
}
export interface ArenaServiceController {
    /** получение списка арен */
    listArenas(request: Empty): Promise<ListArenasResponse> | Observable<ListArenasResponse> | ListArenasResponse;
    /** получение арены по id */
    getArena(request: GetArenaRequest): Promise<GetArenaResponse> | Observable<GetArenaResponse> | GetArenaResponse;
    /** создание арены */
    createArena(request: CreateArenaRequest): Promise<CreateArenaResponse> | Observable<CreateArenaResponse> | CreateArenaResponse;
    /** обновление арены */
    updateArena(request: UpdateArenaRequest): Promise<UpdateArenaResponse> | Observable<UpdateArenaResponse> | UpdateArenaResponse;
    /** удаление арены */
    deleteArena(request: DeleteArenaRequest): Promise<DeleteArenaResponse> | Observable<DeleteArenaResponse> | DeleteArenaResponse;
}
export declare function ArenaServiceControllerMethods(): (constructor: Function) => void;
export declare const ARENA_SERVICE_NAME = "ArenaService";
