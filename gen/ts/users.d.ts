import { Observable } from "rxjs";
export declare const protobufPackage = "users.v1";
export interface GetMeRequest {
    id: string;
}
export interface GetMeResponse {
    user: User | undefined;
}
export interface CreateUserRequest {
    id: string;
}
export interface CreateUserResponse {
    ok: boolean;
}
export interface PatchUserRequest {
    userId: string;
    name?: string | undefined;
    avatar?: string | undefined;
}
export interface PatchUserResponse {
    ok: boolean;
}
export interface User {
    id: string;
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}
export declare const USERS_V1_PACKAGE_NAME = "users.v1";
/** / UsersService отвечает за операции связанные с пользователем. */
export interface UsersServiceClient {
    /**
     * / GetMe id текущего пользователя.
     * / получает объект с данными текущего пользователя
     */
    getMe(request: GetMeRequest): Observable<GetMeResponse>;
    /** / CreateUser создает нового пользователя */
    createUser(request: CreateUserRequest): Observable<CreateUserResponse>;
    /** / PatchUser частично обновляет данные пользователя (имя и/или аватар) */
    patchUser(request: PatchUserRequest): Observable<PatchUserResponse>;
}
/** / UsersService отвечает за операции связанные с пользователем. */
export interface UsersServiceController {
    /**
     * / GetMe id текущего пользователя.
     * / получает объект с данными текущего пользователя
     */
    getMe(request: GetMeRequest): Promise<GetMeResponse> | Observable<GetMeResponse> | GetMeResponse;
    /** / CreateUser создает нового пользователя */
    createUser(request: CreateUserRequest): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;
    /** / PatchUser частично обновляет данные пользователя (имя и/или аватар) */
    patchUser(request: PatchUserRequest): Promise<PatchUserResponse> | Observable<PatchUserResponse> | PatchUserResponse;
}
export declare function UsersServiceControllerMethods(): (constructor: Function) => void;
export declare const USERS_SERVICE_NAME = "UsersService";
