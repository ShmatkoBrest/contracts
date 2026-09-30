export interface OtpRequestedEvent {
    identifier: string
    type: string
    code: string
    /** Организатор-тенант по домену запроса — пусто = общий сайт платформы. */
    organizerId?: string
}
