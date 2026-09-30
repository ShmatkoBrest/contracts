export interface PhoneChangedEvent {
    phone: string
    code: string
    /** Организатор-тенант по домену запроса — пусто = общий сайт платформы. */
    organizerId?: string
}
