// Публикуется screening-service после успешного создания сеанса.
// Потребляется subscription-service для автоматического формирования
// бронирований по активным абонементам, привязанным к EventGroup этого
// события (через event-service).
export interface ScreeningCreatedEvent {
    id: string
    eventId: string
    sectorId: string
    startAt: string
    endAt: string
}
