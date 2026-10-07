"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTO_PATHS = void 0;
const path_1 = require("path");
exports.PROTO_PATHS = {
    AUTH: (0, path_1.join)(__dirname, '../../proto/auth.proto'),
    ACCOUNT: (0, path_1.join)(__dirname, '../../proto/account.proto'),
    USERS: (0, path_1.join)(__dirname, '../../proto/users.proto'),
    MEDIA: (0, path_1.join)(__dirname, '../../proto/media.proto'),
    EVENT: (0, path_1.join)(__dirname, '../../proto/event.proto'),
    CATEGORY: (0, path_1.join)(__dirname, '../../proto/category.proto'),
    ORGANIZER: (0, path_1.join)(__dirname, '../../proto/organizer.proto'),
    PERFORMER: (0, path_1.join)(__dirname, '../../proto/performer.proto'),
    EVENT_GROUP: (0, path_1.join)(__dirname, '../../proto/event-group.proto'),
    ARENA: (0, path_1.join)(__dirname, '../../proto/arena.proto'),
    SECTOR: (0, path_1.join)(__dirname, '../../proto/sector.proto'),
    SEAT: (0, path_1.join)(__dirname, '../../proto/seat.proto'),
    CITY: (0, path_1.join)(__dirname, '../../proto/city.proto'),
    SEAT_TYPE: (0, path_1.join)(__dirname, '../../proto/seat-type.proto'),
    SCREENING: (0, path_1.join)(__dirname, '../../proto/screening.proto'),
    PAYMENT: (0, path_1.join)(__dirname, '../../proto/payment.proto'),
    REFUND: (0, path_1.join)(__dirname, '../../proto/refund.proto'),
    BOOKING: (0, path_1.join)(__dirname, '../../proto/booking.proto'),
    PRICING: (0, path_1.join)(__dirname, '../../proto/pricing.proto'),
    SUBSCRIPTION: (0, path_1.join)(__dirname, '../../proto/subscription.proto'),
    ANALYTICS: (0, path_1.join)(__dirname, '../../proto/analytics.proto'),
    LOYALTY: (0, path_1.join)(__dirname, '../../proto/loyalty.proto'),
    NEWS: (0, path_1.join)(__dirname, '../../proto/news.proto'),
    CONTENT: (0, path_1.join)(__dirname, '../../proto/content.proto'),
    SITE_BUILDER: (0, path_1.join)(__dirname, '../../proto/site_builder.proto'),
    NOTIFICATION: (0, path_1.join)(__dirname, '../../proto/notification.proto'),
};
