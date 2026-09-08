// Публикуется screening-service после успешного создания сеанса.
// Потребляется subscription-service для автоматического формирования
// бронирований по активным абонементам, привязанным к EventGroup этого
// события (через event-service).
//
// 3.7.0: сеанс проводится на всей арене (раньше — на одном секторе),
// поэтому вместо sectorId передаётся arenaId.
export interface ScreeningCreatedEvent {
    id: string
    eventId: string
    arenaId: string
    startAt: string
    endAt: string
}
