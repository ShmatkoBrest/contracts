"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_COMP_CLAIM_EMAIL_REQUESTED = void 0;
// Публикуется subscription-service (EmailComplimentarySubscriptionUsecase) —
// админ выдал пригласительный абонемент(ы) и запросил отправить код(ы)
// привязки на e-mail получателя (получатель заранее не известен, как и у
// пригласительных билетов — см. TICKETS_EMAIL_REQUESTED). Потребляется
// notification-service.
//
// Не через транзакционный outbox (в отличие от TICKETS_EMAIL_REQUESTED) —
// осознанно: у subscription-service нет ни одного другого producer'а RMQ,
// заводить outbox-таблицу+диспетчер ради одного необязательного письма
// несоразмерно риску (при сбое админ просто продиктует код(ы) получателю —
// они и так уже показаны в интерфейсе выдачи, а не теряются безвозвратно).
exports.SUBSCRIPTION_COMP_CLAIM_EMAIL_REQUESTED = 'subscription.comp.claim_email_requested';
