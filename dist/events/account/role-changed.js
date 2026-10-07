"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_ROLE_CHANGED = void 0;
// Публикуется auth-service (AccountService.setAccountRole) при изменении
// роли/organizerId аккаунта. Потребляется gateway-service — инвалидирует
// Redis-кэш роли (см. RolesGuard, Этап 3), чтобы отзыв/смена роли не ждала
// истечения TTL кэша, а не пропадала совсем: событие best-effort (без
// транзакционного outbox), потому что пропуск не теряет данные — кэш и так
// самоисцеляется по TTL, событие лишь ускоряет распространение.
exports.ACCOUNT_ROLE_CHANGED = 'account.role.changed';
