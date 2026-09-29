import { Observable } from "rxjs";
export declare const protobufPackage = "refund.v1";
export interface CreateRefundRequest {
    bookingId: string;
    userId: string;
}
export interface CreateStaffRefundRequest {
    bookingId: string;
    actorId: string;
}
export interface CreateRefundResponse {
    ok: boolean;
}
export interface ProcessRefundEventRequest {
    event: string;
    providerRefundId: string;
    status: string;
    reason?: string | undefined;
}
export interface ProcessRefundEventResponse {
    ok: boolean;
}
export declare const REFUND_V1_PACKAGE_NAME = "refund.v1";
export interface RefundServiceClient {
    /** Создание возврата (самообслуживание — только владелец платежа) */
    createRefund(request: CreateRefundRequest): Observable<CreateRefundResponse>;
    /**
     * 2026-09-21: возврат, инициированный кассиром/админом — без проверки
     * владения платежом (сотрудник оформляет возврат ЗА покупателя, а не от
     * своего имени). actor_id — только для аудита/логов.
     */
    createStaffRefund(request: CreateStaffRefundRequest): Observable<CreateRefundResponse>;
    /** Обработка  (снятие брони) от платежной системы */
    processRefundEvent(request: ProcessRefundEventRequest): Observable<ProcessRefundEventResponse>;
}
export interface RefundServiceController {
    /** Создание возврата (самообслуживание — только владелец платежа) */
    createRefund(request: CreateRefundRequest): Promise<CreateRefundResponse> | Observable<CreateRefundResponse> | CreateRefundResponse;
    /**
     * 2026-09-21: возврат, инициированный кассиром/админом — без проверки
     * владения платежом (сотрудник оформляет возврат ЗА покупателя, а не от
     * своего имени). actor_id — только для аудита/логов.
     */
    createStaffRefund(request: CreateStaffRefundRequest): Promise<CreateRefundResponse> | Observable<CreateRefundResponse> | CreateRefundResponse;
    /** Обработка  (снятие брони) от платежной системы */
    processRefundEvent(request: ProcessRefundEventRequest): Promise<ProcessRefundEventResponse> | Observable<ProcessRefundEventResponse> | ProcessRefundEventResponse;
}
export declare function RefundServiceControllerMethods(): (constructor: Function) => void;
export declare const REFUND_SERVICE_NAME = "RefundService";
