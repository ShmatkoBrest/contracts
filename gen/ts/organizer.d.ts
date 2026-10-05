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
export declare const ORGANIZER_V1_PACKAGE_NAME = "organizer.v1";
/**
 * Сервис для работы с организаторами событий.
 * Одиночная платформа: мутирующие RPC убраны — организатор создаётся
 * через seed / прямой SQL, управление через admin-UI не предусмотрено.
 */
export interface OrganizerServiceClient {
    listOrganizers(request: Empty): Observable<ListOrganizersResponse>;
    getOrganizer(request: GetOrganizerRequest): Observable<GetOrganizerResponse>;
}
/**
 * Сервис для работы с организаторами событий.
 * Одиночная платформа: мутирующие RPC убраны — организатор создаётся
 * через seed / прямой SQL, управление через admin-UI не предусмотрено.
 */
export interface OrganizerServiceController {
    listOrganizers(request: Empty): Promise<ListOrganizersResponse> | Observable<ListOrganizersResponse> | ListOrganizersResponse;
    getOrganizer(request: GetOrganizerRequest): Promise<GetOrganizerResponse> | Observable<GetOrganizerResponse> | GetOrganizerResponse;
}
export declare function OrganizerServiceControllerMethods(): (constructor: Function) => void;
export declare const ORGANIZER_SERVICE_NAME = "OrganizerService";
