import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "performer.v1";
export interface ListPerformersResponse {
    performers: Performer[];
}
export interface GetPerformerRequest {
    id: string;
}
export interface GetPerformerResponse {
    performer: Performer | undefined;
}
export interface CreatePerformerRequest {
    title: string;
    description: string;
    image: string;
}
export interface CreatePerformerResponse {
    performer: Performer | undefined;
}
export interface UpdatePerformerRequest {
    id: string;
    title: string;
    description: string;
    image: string;
}
export interface UpdatePerformerResponse {
    performer: Performer | undefined;
}
export interface DeletePerformerRequest {
    id: string;
}
export interface DeletePerformerResponse {
    ok: boolean;
}
export interface Performer {
    id: string;
    title: string;
    description: string;
    image: string;
}
export declare const PERFORMER_V1_PACKAGE_NAME = "performer.v1";
/** Сервис для работы с исполнителями (участниками события) */
export interface PerformerServiceClient {
    /** получение списка исполнителей */
    listPerformers(request: Empty): Observable<ListPerformersResponse>;
    /** получение исполнителя по id */
    getPerformer(request: GetPerformerRequest): Observable<GetPerformerResponse>;
    /** создание исполнителя */
    createPerformer(request: CreatePerformerRequest): Observable<CreatePerformerResponse>;
    /** обновление исполнителя */
    updatePerformer(request: UpdatePerformerRequest): Observable<UpdatePerformerResponse>;
    /** удаление исполнителя */
    deletePerformer(request: DeletePerformerRequest): Observable<DeletePerformerResponse>;
}
/** Сервис для работы с исполнителями (участниками события) */
export interface PerformerServiceController {
    /** получение списка исполнителей */
    listPerformers(request: Empty): Promise<ListPerformersResponse> | Observable<ListPerformersResponse> | ListPerformersResponse;
    /** получение исполнителя по id */
    getPerformer(request: GetPerformerRequest): Promise<GetPerformerResponse> | Observable<GetPerformerResponse> | GetPerformerResponse;
    /** создание исполнителя */
    createPerformer(request: CreatePerformerRequest): Promise<CreatePerformerResponse> | Observable<CreatePerformerResponse> | CreatePerformerResponse;
    /** обновление исполнителя */
    updatePerformer(request: UpdatePerformerRequest): Promise<UpdatePerformerResponse> | Observable<UpdatePerformerResponse> | UpdatePerformerResponse;
    /** удаление исполнителя */
    deletePerformer(request: DeletePerformerRequest): Promise<DeletePerformerResponse> | Observable<DeletePerformerResponse> | DeletePerformerResponse;
}
export declare function PerformerServiceControllerMethods(): (constructor: Function) => void;
export declare const PERFORMER_SERVICE_NAME = "PerformerService";
