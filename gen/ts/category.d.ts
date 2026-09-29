import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "category.v1";
/** Запросы */
export interface CreateCategoryRequest {
    title: string;
    slug: string;
    /**
     * 3.36.0: у событий этой категории — ровно один сеанс (например, футбольный/
     * хоккейный матч) — гейтит инлайн-создание сеанса прямо в форме события.
     */
    singleScreening: boolean;
}
export interface UpdateCategoryRequest {
    id: string;
    title: string;
    slug: string;
    singleScreening: boolean;
}
export interface DeleteCategoryRequest {
    id: string;
}
export interface DeleteCategoryResponse {
    ok: boolean;
}
/** Ответы */
export interface GetAllCategoriesResponse {
    categories: Category[];
}
export interface Category {
    id: string;
    title: string;
    slug: string;
    singleScreening: boolean;
}
export declare const CATEGORY_V1_PACKAGE_NAME = "category.v1";
/** Сервис для работы с категориями */
export interface CategoryServiceClient {
    /** получение всех категорий */
    getAllCategories(request: Empty): Observable<GetAllCategoriesResponse>;
    /** создание категории */
    createCategory(request: CreateCategoryRequest): Observable<Category>;
    /** обновление категории */
    updateCategory(request: UpdateCategoryRequest): Observable<Category>;
    /** удаление категории */
    deleteCategory(request: DeleteCategoryRequest): Observable<DeleteCategoryResponse>;
}
/** Сервис для работы с категориями */
export interface CategoryServiceController {
    /** получение всех категорий */
    getAllCategories(request: Empty): Promise<GetAllCategoriesResponse> | Observable<GetAllCategoriesResponse> | GetAllCategoriesResponse;
    /** создание категории */
    createCategory(request: CreateCategoryRequest): Promise<Category> | Observable<Category> | Category;
    /** обновление категории */
    updateCategory(request: UpdateCategoryRequest): Promise<Category> | Observable<Category> | Category;
    /** удаление категории */
    deleteCategory(request: DeleteCategoryRequest): Promise<DeleteCategoryResponse> | Observable<DeleteCategoryResponse> | DeleteCategoryResponse;
}
export declare function CategoryServiceControllerMethods(): (constructor: Function) => void;
export declare const CATEGORY_SERVICE_NAME = "CategoryService";
