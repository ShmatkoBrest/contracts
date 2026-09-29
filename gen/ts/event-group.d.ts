import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "event_group.v1";
export interface ListEventGroupsResponse {
    eventGroups: EventGroup[];
}
export interface GetEventGroupRequest {
    id: string;
}
export interface GetEventGroupResponse {
    eventGroup: EventGroup | undefined;
}
export interface CreateEventGroupRequest {
    title: string;
    description: string;
}
export interface CreateEventGroupResponse {
    eventGroup: EventGroup | undefined;
}
export interface UpdateEventGroupRequest {
    id: string;
    title: string;
    description: string;
}
export interface UpdateEventGroupResponse {
    eventGroup: EventGroup | undefined;
}
export interface DeleteEventGroupRequest {
    id: string;
}
export interface DeleteEventGroupResponse {
    ok: boolean;
}
export interface EventGroup {
    id: string;
    title: string;
    description: string;
}
export declare const EVENT_GROUP_V1_PACKAGE_NAME = "event_group.v1";
/**
 * Сервис для работы с группами мероприятий (например, "Сезон 2026" клуба) —
 * используется subscription-service для привязки абонементов к серии
 * событий одного клуба/турнира.
 */
export interface EventGroupServiceClient {
    /** получение списка групп мероприятий */
    listEventGroups(request: Empty): Observable<ListEventGroupsResponse>;
    /** получение группы по id */
    getEventGroup(request: GetEventGroupRequest): Observable<GetEventGroupResponse>;
    /** создание группы */
    createEventGroup(request: CreateEventGroupRequest): Observable<CreateEventGroupResponse>;
    /** обновление группы */
    updateEventGroup(request: UpdateEventGroupRequest): Observable<UpdateEventGroupResponse>;
    /** удаление группы */
    deleteEventGroup(request: DeleteEventGroupRequest): Observable<DeleteEventGroupResponse>;
}
/**
 * Сервис для работы с группами мероприятий (например, "Сезон 2026" клуба) —
 * используется subscription-service для привязки абонементов к серии
 * событий одного клуба/турнира.
 */
export interface EventGroupServiceController {
    /** получение списка групп мероприятий */
    listEventGroups(request: Empty): Promise<ListEventGroupsResponse> | Observable<ListEventGroupsResponse> | ListEventGroupsResponse;
    /** получение группы по id */
    getEventGroup(request: GetEventGroupRequest): Promise<GetEventGroupResponse> | Observable<GetEventGroupResponse> | GetEventGroupResponse;
    /** создание группы */
    createEventGroup(request: CreateEventGroupRequest): Promise<CreateEventGroupResponse> | Observable<CreateEventGroupResponse> | CreateEventGroupResponse;
    /** обновление группы */
    updateEventGroup(request: UpdateEventGroupRequest): Promise<UpdateEventGroupResponse> | Observable<UpdateEventGroupResponse> | UpdateEventGroupResponse;
    /** удаление группы */
    deleteEventGroup(request: DeleteEventGroupRequest): Promise<DeleteEventGroupResponse> | Observable<DeleteEventGroupResponse> | DeleteEventGroupResponse;
}
export declare function EventGroupServiceControllerMethods(): (constructor: Function) => void;
export declare const EVENT_GROUP_SERVICE_NAME = "EventGroupService";
