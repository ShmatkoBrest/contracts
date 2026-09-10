# @usteam/contracts

Общий пакет контрактов платформы — единый источник истины для всех межсервисных взаимодействий по gRPC и части асинхронных событий (RabbitMQ). Публикуется как npm-пакет `@usteam/contracts`, подключается всеми сервисами платформы.

## Назначение

1. **Protobuf-контракты** (`proto/*.proto`) — единственное описание всех gRPC-сервисов платформы и их сообщений.
2. **Генерируемые типы** — TypeScript (`ts-proto`, `nestJs=true`) из `.proto`-файлов, компилируются в `gen/ts/*.js`+`.d.ts` отдельным шагом сборки (`build:gen`, см. историю изменений).
3. **`PROTO_PATHS`** — карта путей к `.proto`-файлам на диске.
4. **TS-интерфейсы для RabbitMQ-событий** (`src/events/*`) — контракты асинхронных событий между сервисами.

## Стек

- **Protocol Buffers 3** (`proto3`)
- **ts-proto** — генерация TS/NestJS-типов
- TypeScript (сборка через `tsc`, два прохода: `build:gen` для `gen/ts`, затем основной `build` для `src/`)
- GitHub Actions — автопубликация в npm при пуше в `main`

## Структура

```
proto/
├── auth.proto                 # auth-service
├── account.proto                # auth-service: role — string-ключ (справочник `roles` в auth-service)
├── users.proto                    # users-service
├── media.proto                      # media-service (Go)
├── arena.proto                        # arena-service
├── sector.proto                         # arena-service: SectorMode, RowLayout (без price)
├── seat.proto                             # arena-service (без price)
├── event.proto                              # event-service: +event_group_id
├── category.proto                             # event-service
├── organizer.proto                              # event-service
├── performer.proto                                # event-service
├── event-group.proto                                # event-service — новое
├── screening.proto                                    # screening-service: сеанс на арене (arena_id, 3.7.0)
├── booking.proto                                        # booking-service: SeatInput (без price)
├── payment.proto                                          # payment-service: +CreateGenericPayment
├── refund.proto                                             # payment-service
├── pricing.proto                                              # pricing-service
└── subscription.proto                                           # subscription-service — новое

gen/
├── ts/                     # компилируется в .js/.d.ts на месте (build:gen), в git — пусто
└── go/media/

src/
├── proto/
│   ├── paths.ts               # PROTO_PATHS, включая EVENT_GROUP, SUBSCRIPTION
│   └── index.ts
├── events/
│   ├── auth/otp-requested.interface.ts
│   ├── account/email-changed.ts, phone-changed.ts
│   ├── screening/screening-created.interface.ts    # новое
│   └── index.ts
└── index.ts

tsconfig.gen.json           # компиляция gen/ts на месте — новое, см. историю
tsconfig.build.json
```

## gRPC-сервисы по `.proto`-файлам

| Файл | Пакет | Сервис | Ключевые методы |
|---|---|---|---|
| `auth.proto` | `auth.v1` | `AuthService` | `SendOtp`, `VerifyOtp`, `Refresh`, Telegram-флоу |
| `account.proto` | `account.v1` | `AccountService` | `GetAccount`, смена email/телефона; `role` — string-ключ (`USER`/`ADMIN`/`EDITOR`/`CASHIER`) |
| `users.proto` | `users.v1` | `UsersService` | `GetMe`, `CreateUser`, `PatchUser` |
| `media.proto` | `media.v1` | `MediaService` | `Upload`, `Get`, `Delete` |
| `arena.proto` | `arena.v1` | `ArenaService` | CRUD арен |
| `sector.proto` | `sector.v1` | `SectorService` | CRUD секторов, `GetSectorWithSeats`; enum `SectorMode` |
| `seat.proto` | `seat.v1` | `SeatService` | `GetSeat`, `ListSeatsBySector` |
| `event.proto` | `event.v1` | `EventService` | CRUD событий, теперь с `event_group_id` |
| `category.proto` | `category.v1` | `CategoryService` | CRUD категорий |
| `organizer.proto` | `organizer.v1` | `OrganizerService` | CRUD организаторов |
| `performer.proto` | `performer.v1` | `PerformerService` | CRUD исполнителей |
| **`event-group.proto`** | `event_group.v1` | `EventGroupService` | CRUD групп мероприятий — **новое** |
| `screening.proto` | `screening.v1` | `ScreeningService` | CRUD сеансов |
| `booking.proto` | `booking.v1` | `BookingService` | Брони, билеты |
| `payment.proto` | `payment.v1` | `PaymentService` | Платежи, методы оплаты, **+`CreateGenericPayment`** |
| `refund.proto` | `refund.v1` | `RefundService` | Возвраты |
| `pricing.proto` | `pricing.v1` | `PricingService` | `CalculatePrice` + CRUD правил ценообразования |
| **`subscription.proto`** | `subscription.v1` | `SubscriptionService` | Абонементы — **новое, 15 методов** |

## Новые контракты этого прохода

### `event-group.proto`
`EventGroupService` — CRUD группы мероприятий (например, "Сезон 2026" клуба). Живёт в `event-service`, по образцу `Organizer`/`Performer`. `event.proto` дополнен полем `event_group_id` в `CreateEventRequest`/`UpdateEventRequest`/`EventDetails` — опциональная связь события с группой.

### `subscription.proto`
`SubscriptionService` — 15 методов: CRUD планов абонементов (`SubscriptionPlan`), покупка/отмена (`PurchaseSubscription`/`CancelSubscription`), проверка доступа (`CheckSubscriptionAccess`), управление бронированиями по абонементу (`ReleaseSubscriptionSeat`/`ListSubscriptionReservations`). Enum `SubscriptionType {FIXED_SEAT, GENERAL_ADMISSION}`, `SubscriptionStatus {PENDING, ACTIVE, EXPIRED, BLOCKED, CANCELED}`. Обёртка `EventGroupIdList` (по образцу `PerformerIdList` в `event.proto`) — различает "поле не передано" от "передан пустой список" при обновлении плана.

### `payment.proto`: новый `rpc CreateGenericPayment`
Платёж без привязки к бронированию через `booking-service` (в отличие от `CreatePayment`, которая жёстко требует создания резервации перед оплатой). Используется `subscription-service` при покупке абонемента. `callback_url` указывает вызывающая сторона — платёжный провайдер шлёт вебхук напрямую туда, а не в `payment-service`: это осознанное архитектурное решение, чтобы не заводить обратный вызов `payment-service → subscription-service` (не заводить `SubscriptionPort` на стороне `payment-service`).

## Асинхронные события (RabbitMQ, `src/events`)

| Интерфейс | Поля | Публикует | Потребляет |
|---|---|---|---|
| `OtpRequestedEvent` | `identifier, type, code` | `auth-service` | `notification-service` |
| `EmailChangedEvent` | `email, code` | `auth-service` | `notification-service` |
| `PhoneChangedEvent` | `phone, code` | `auth-service` | `notification-service` |
| **`ScreeningCreatedEvent`** | `id, eventId, arenaId, startAt, endAt` (3.7.0: `sectorId` → `arenaId`) | `screening-service` | `subscription-service` |
| **`SeatStatusChangedEvent`** (`seat.reserved`/`released`/`sold`) | `screeningId, sectorId, seatIds[], at` | `booking-service` | `gateway-service` (ретранслирует по WebSocket в комнату `screening:<id>`) — **новое, 3.2.0** |

`ScreeningCreatedEvent` — первое событие в платформе, публикуемое не для уведомлений (email/SMS), а для доменной оркестрации (авто-формирование бронирований по активным абонементам). `SeatStatusChangedEvent` — первое событие для доставки в UI в реальном времени (очередь `gateway_rt_queue`).

## Breaking changes

### `3.0.0` — `account.v1`: `Role` enum → `string`

Роли пользователей вынесены из hardcoded-enum в справочную таблицу `roles` в `auth-service` (одна роль на аккаунт). В контракте:

- `enum Role` **удалён**;
- `GetAccountResponse.role` теперь `string` (ключ роли: `USER` / `ADMIN` / `EDITOR` / `CASHIER`), а не `Role`.

Канонический список ключей — `ROLE_KEYS` в `@usteam/common` (`>= 1.8.0`). Единственный потребитель поля — `RolesGuard` в `gateway-service` — обновлён на сравнение по строковому ключу.

### `2.0.0` — удаление `price` (для справки)

С появлением `pricing-service` поле `price` было удалено из `seat.proto` (`Seat`), `sector.proto` (`RowLayout`), `screening.proto` (`SeatType`), `booking.proto`/`payment.proto` (`SeatInput`).

## ⚠️ Представление enum на wire-уровне — не гарантированно единообразно

Обнаружено при разработке `pricing-service`: то, как `@grpc/proto-loader` представляет значения proto3 `enum` в JS (число или строка-имя константы), зависит от конфигурации загрузчика **конкретной стороны**, а не задаётся контрактом. `ts-proto` при этом всегда генерирует числовые TS-типы для enum-полей независимо от рантайм-конфигурации. Решение — утилита `protoEnumToDomain` в `@usteam/common` для **входящих** enum-полей; **исходящие** можно безопасно кодировать числовыми константами напрямую. Применено в enum-полях `SectorMode`, `RuleType`/`ValueType`, `SubscriptionType`/`SubscriptionStatus`/`SubscriptionReservationStatus`. Полный аудит платформы на предмет остальных enum-полей не проводился.

> `Role` больше не enum (см. breaking change `3.0.0`) — эта проблема к нему больше не относится, роль передаётся строковым ключом.

## Публикация

`.github/workflows/publish-npm.yml` — при пуше в `main`: `Install deps` → `Generate TS Protobuf` (`npm run generate`) → `Build` → `Publish`. **Порядок шагов был исправлен** (раньше `Build` шёл раньше `Generate` — см. историю изменений).

## Запуск/разработка локально

```bash
npm install
npm run generate     # protoc + ts-proto → gen/ts/*.ts
npm run build         # build:gen (компилирует gen/ts на месте) + tsc src → dist/
```

## История изменений

| Дата/повод | Что изменилось |
|---|---|
| Приватный SSH-ключ в репозитории, устаревший `dist/`, опечатки, отсутствующий README | ✅ Исправлено (ранние проходы) |
| Добавлены `organizer.proto`/`performer.proto` | ✅ Версия `1.7.0` |
| `event.proto` дополнен `organizer_id`/`performer_ids` | ✅ Версия `1.8.0` |
| `sector.proto`: `SectorMode`, `capacity`, `GetSectorWithSeats` | ✅ Версия `1.9.0` |
| **Появление `pricing-service`**: новый `pricing.proto`; `price` убран из 4 контрактов | ✅ Версия `2.0.0` (breaking) |
| `event.proto`/`sector.proto`/`payment.proto` мелкие правки | ✅ Версии `2.1.0`–`2.2.0` |
| 🚨 **Найден и исправлен пробел в пайплайне сборки**: `gen/ts/*.ts` компилировался в `.js` только предположительно — на деле `tsconfig.build.json` компилирует только `src/**/*`, `gen/ts` не входил в его `include` вовсе. При обычном `node dist/main.js` в сервисах-потребителях это приводило к рантайм-ошибке `Cannot find module '@usteam/contracts/gen/ts/...'`, несмотря на успешный тайпчек (типы резолвились из `.ts`-исходника, а не из скомпилированного `.js`, которого не существовало) | ✅ Исправлено — добавлен `tsconfig.gen.json` (компиляция `gen/ts` **на месте**: `outDir === rootDir`, чтобы deep-импорты вида `@usteam/contracts/gen/ts/sector` продолжали резолвиться), новый скрипт `build:gen`, `build` теперь запускает оба прохода |
| 🚨 **Найдена и исправлена ошибка в самом CI-воркфлоу**: шаг `Build` шёл **раньше** `Generate TS Protobuf` — даже с фиксом `build:gen` это означало бы компиляцию пустой папки `gen/ts` при каждой публикации в npm | ✅ Исправлено — порядок шагов: `Install deps → Generate → Build → Publish` |
| **Появление `subscription-service`**: новые `event-group.proto`, `subscription.proto`; `event.proto` +`event_group_id`; `payment.proto` +`CreateGenericPayment`; новое событие `ScreeningCreatedEvent` | ✅ Версия `2.3.0` |
| **Роли вынесены в таблицу** (`auth-service`): `enum Role` удалён, `GetAccountResponse.role` → `string`-ключ | ✅ Версия `3.0.0` (breaking) |
| **Пробелы для фронта (аддитивно)**: `booking` +`GetBooking`; `pricing` +`ListPriceTemplates`; `account` +`ListAccounts`/`SetAccountRole`/`ListRoles` (+`Role` message); `event.ListEventsRequest` +фильтры/пагинация, `ListEventsResponse` +`total`; `sector.RowLayout` +геометрия рядов (`start_number`, `gaps`, `seat_spacing`, `row_spacing`, `offset_x`, `curve`) | ✅ Версия `3.1.0` (только новые rpc/поля — не breaking) |
| **Real-time + касса + свободная раскладка (аддитивно)**: `src/events/seat` — `SeatStatusChangedEvent` (`seat.reserved`/`released`/`sold`, публикует booking-service, ретранслирует gateway по WS); `payment` +`GetPaymentByBooking`/`PaymentStatus`, `CreatePaymentResponse` +`booking_id`; `sector` +`SeatPositionInput` (свободный режим редактора), `Create/UpdateSectorRequest` +`seats`/`shape_json`, `Sector` +`shape_json` | ✅ Версия `3.2.0` |
| **Кассовые смены (аддитивно)**: `booking.proto` +`CreateCashierSale` (бронь+подтверждение+учёт в смене), +`OpenShift`/`CloseShift`/`GetCurrentShift`/`ListShiftSales`; сообщения `Shift`/`ShiftReport`/`CashierSaleItem`, enum `ShiftStatus` | ✅ Версия `3.3.0` |
| **Аналитика (новый сервис)**: `analytics.proto` (`analytics.v1`) — `GetOverview`/`GetSalesTimeseries`/`GetTopEvents`/`GetOccupancy`/`GetCashierStats`. `PROTO_PATHS.ANALYTICS`. Реализует `analytics-service` (read-only чтение БД остальных сервисов) | ✅ Версия `3.4.0` |
| **Города + типы мест + доработки конструктора зала (аддитивно)**: новый `city.proto` (`city.v1` — CRUD городов, живёт в arena-service; `PROTO_PATHS.CITY`); новый `seat-type.proto` (`seat_type.v1` — палитра типов мест per-arena; `PROTO_PATHS.SEAT_TYPE`); `arena.proto`: `Arena`/`Create`/`Update` +`city_id`/`plan_image` (+`city_slug` денорм. при чтении); `sector.proto`: `RowLayout` +`number_rtl`, новое сообщение `SeatDetail`, `GetSectorWithSeatsResponse` +`seats: SeatDetail[]`; `seat.proto`: `Seat` +`x`/`y`, `ListSeatsRequest.screening_id` — пусто = без статуса брони | ✅ Версия `3.5.0` |
| **Программа лояльности (новый сервис, аддитивно)**: новый `loyalty.proto` (`loyalty.v1`, `PROTO_PATHS.LOYALTY`) — `GetBalance`/`GetHistory`/`PreviewEarn`/`QuoteRedeem`/`Earn`/`GrantPromoBonus`/`Redeem`/`ReturnRedeemed`/`RefundAdjust` + админ (`GetRule`/`UpdateRule`/`ListEventRules`/`SetEventRule`/`Adjust`). Реализует `loyalty-service` (append-only леджер, 1 балл = 1 копейка). `pricing.proto`: `PromoCode`/`CreatePromoCodeRequest` +`bonus_points`, `CalculatePriceResponse` +`promo_bonus_points`. `payment.proto` `CreatePaymentRequest` +`redeem_points`. `booking.proto` `CreateCashierSaleRequest` +`redeem_points` | ✅ Версия `3.6.0` |
| **Сеанс — на всей арене, а не на одном секторе (breaking)**: `screening.proto` — `CreateScreeningRequest`/`UpdateScreeningRequest` `sector_id` → `arena_id`; `Screening` — удалены `Sector sector = 5` и `repeated SeatType seat_type = 7` (+локальные сообщения `Sector`/`SeatType`). `booking.proto` — `BookingSeatInfo` +`sector_name` (сектор у каждого места), `BookingItem` — удалён `BookingSectorInfo sector = 6`. `ScreeningCreatedEvent` `sectorId` → `arenaId`. Сектор выбирается при выборе мест; один заказ может охватывать несколько секторов. booking-service резолвит сектор каждого места через `seat.v1 GetSeat` | ✅ Версия `3.7.0` (breaking) |
| **Права кассиров на продажу сеанса (аддитивно)**: `screening.proto` — `GetScreeningsRequest` +`cashier_id` (если задан — только разрешённые кассиру сеансы; сеанс без назначенных кассиров открыт всем); новые RPC `GetScreeningCashiers`/`SetScreeningCashiers` (админ, `repeated string cashier_ids`, пустой список = открыт всем) и `CanCashierSell(cashier_id, screening_id) → bool` (для booking-service при кассовой продаже). Реализует `screening-service` (таблица `screening_cashiers`). Gateway: `GET /cashier/screenings` (кассир), `GET/PUT /screenings/:id/cashiers` (ADMIN/EDITOR). booking-service: `CanCashierSell` перед `CreateCashierSale` → `PERMISSION_DENIED` | ⏳ Версия `3.8.0` — **не опубликована**, локально синхронизирована в `node_modules` затронутых сервисов |
| **Сервис новостей (новый, аддитивно)**: новый `news.proto` (`news.v1`, `PROTO_PATHS.NEWS`) — один сервис `NewsService`: категории (`ListCategories`/`CreateCategory`/`UpdateCategory`/`DeleteCategory`) + новости (`ListArticles`/`GetArticle`/`CreateArticle`/`UpdateArticle`/`DeleteArticle`). `ArticleDetails` несёт `repeated NewsRelation relations` (`{type, ref_id}`, тип `EVENT`/`EVENT_GROUP`/`PERFORMER`/`ORGANIZER`). Даты — ISO-строки (не `Timestamp`), `status`/`type` — string enum. `UpdateArticleRequest` — `optional` поля + обёртки `StringList`/`RelationList` для presence repeated. Реализует `news-service` (порт 50058, БД `usteam_news`). Gateway резолвит `relations` через event/event-group/organizer/performer | ✅ Версия `3.9.0` (3.8.0 пропущена — влилась сюда) |
| **Пакетные RPC для устранения N+1 в бронировании (аддитивно)**: `seat.proto` — `GetSeats(GetSeatsRequest{ids}) → GetSeatsResponse{seats[]}` (статус брони не считает, несуществующие id пропускает). `pricing.proto` — `CalculatePrices(CalculatePricesRequest{screening_id, user_id, items:[{sector_id, seat_id?}], audience_code?, promo_code?, quantity, purchase_date?}) → CalculatePricesResponse{results:[{seat_id, final_price, snapshot_id}]}` (на каждый элемент — свой PriceSnapshot, порядок сохраняется). `booking-service.CreateReservation` вместо N поштучных `GetSeat`/`CalculatePrice` делает по одному пакетному вызову | ✅ Версия `3.10.0` |

## Требует внимания

- Полный аудит enum-полей контрактов на предмет уязвимости wire-представления — не проведён.
- Пайплайн сборки `gen/ts` (двухпроходная компиляция) не был протестирован в реальном CI-прогоне (нет сети/`protoc` в среде разработки) — стоит проверить сквозным прогоном при следующей публикации.
