export declare const SUBSCRIPTION_COMP_CLAIM_EMAIL_REQUESTED = "subscription.comp.claim_email_requested";
export interface SubscriptionCompClaimItem {
    planTitle: string;
    /** Пусто у GA-абонемента без места (капитан жетон не привязан к месту). */
    sectorName?: string;
    row?: number;
    number?: number;
    claimCode: string;
}
export interface SubscriptionCompClaimEmailRequestedEvent {
    email: string;
    items: SubscriptionCompClaimItem[];
}
