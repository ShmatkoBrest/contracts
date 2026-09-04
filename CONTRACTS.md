# @usteam/contracts

Общий пакет контрактов платформы — единый источник истины для всех межсервисных взаимодействий по gRPC и части асинхронных событий (RabbitMQ). Публикуется как npm-пакет `@usteam/contracts` и как Go-модуль `github.com/ShmatkoBrest/contracts`, подключается всеми сервисами платформы (кроме, разумеется, самого себя).

## Назначение

1. **Protobuf-контракты** (`proto/*.proto`) — единственное описание всех gRPC-сервисов платформы и их сообщений.
2. **Генерируемые типы** — TypeScript (`ts-proto`, с `nestJs=true`) и Go (`protoc-gen-go`/`protoc-gen-go-grpc`) клиенты/серверы из тех же `.proto`-файлов.
3. **`PROTO_PATHS`** — карта путей к `.proto`-файлам на диске (для `@grpc/proto-loader` в сервисах, использующих `loadSync`, например `bot-service`).
4. **TS-интерфейсы для RabbitMQ-событий** (`src/events/*`) — контракты асинхронных событий между `auth-service` и `notification-service`.

## Стек

- **Protocol Buffers 3** (`proto3`) — язык описания контрактов
- **ts-proto** — генерация TS/NestJS-типов и клиентских интерфейсов (`*ServiceClient`) из `.proto`
- **protoc-gen-go** / **protoc-gen-go-grpc** — генерация Go-типов (сейчас только для `media.proto`, единственного Go-сервиса платформы)
- TypeScript (сборка через `tsc`)
- GitHub Actions — автопубликация в npm и (отдельным воркфлоу) генерация/публикация Go-модуля при пуше в `main`

## Структура

```
proto/
├── auth.proto                 # auth-service: OTP, refresh, Telegram-флоу
├── account.proto                # auth-service: аккаунт, смена email/телефона, Role enum
├── users.proto                    # users-service: профиль (GetMe/CreateUser/PatchUser)
├── media.proto                      # media-service: Upload/Get/Delete файлов в S3
├── arena.proto                        # arena-service: CRUD арен
├── sector.proto                         # arena-service: CRUD секторов + RowLayout (без price, см. историю)
├── seat.proto                             # arena-service: чтение мест (без price, см. историю)
├── event.proto                              # event-service: CRUD событий
├── category.proto                             # event-service: CRUD категорий
├── organizer.proto                              # event-service: CRUD организаторов
├── performer.proto                                # event-service: CRUD исполнителей
├── screening.proto                                  # screening-service: CRUD сеансов (SeatType без price, см. историю)
├── booking.proto                                      # booking-service: брони, билеты (SeatInput без price, см. историю)
├── payment.proto                                        # payment-service: платежи, методы оплаты (SeatInput без price, см. историю)
├── refund.proto                                           # payment-service: возвраты
└── pricing.proto                                            # pricing-service: расчёт цены билета — новое

gen/
├── ts/                     # генерируется при publish (npm run generate), в репозитории пусто
└── go/media/                # сгенерированные Go-типы для media.proto

src/
├── proto/
│   ├── paths.ts               # PROTO_PATHS, включая PRICING
│   └── index.ts
├── events/
│   ├── auth/otp-requested.interface.ts
│   ├── account/email-changed.ts
│   ├── account/phone-changed.ts
│   └── index.ts
└── index.ts

scripts/generate_go.sh
README.md
```

`dist/` не хранится в рабочей копии пакета — пересобирается перед каждой публикацией в CI.

## gRPC-сервисы по `.proto`-файлам

| Файл | Пакет | Сервис | Методы |
|---|---|---|---|
| `auth.proto` | `auth.v1` | `AuthService` | `SendOtp`, `VerifyOtp`, `Refresh`, `TelegramInit`, `TelegramVerify`, `TelegramComplete`, `TelegramConsume` |
| `account.proto` | `account.v1` | `AccountService` | `GetAccount`, `InitEmailChange`, `ConfirmEmailChange`, `InitPhoneChange`, `ConfirmPhoneChange`; enum `Role {USER, ADMIN, EDITOR, CASHIER}` |
| `users.proto` | `users.v1` | `UsersService` | `GetMe`, `CreateUser`, `PatchUser` |
| `media.proto` | `media.v1` | `MediaService` | `Upload`, `Get`, `Delete` |
| `arena.proto` | `arena.v1` | `ArenaService` | `ListArenas`, `GetArena`, `CreateArena`, `UpdateArena`, `DeleteArena` |
| `sector.proto` | `sector.v1` | `SectorService` | `CreateSector`, `GetSector`, `GetSectorWithSeats`, `ListSectorsByArena`, `UpdateSector`, `DeleteSector`; enum `SectorMode {RESERVED, GENERAL_ADMISSION}` |
| `seat.proto` | `seat.v1` | `SeatService` | `GetSeat`, `ListSeatsBySector` |
| `event.proto` | `event.v1` | `EventService` | `ListEvents`, `GetEvents`, `CreateEvent`, `UpdateEvent`, `DeleteEvent` |
| `category.proto` | `category.v1` | `CategoryService` | `GetAllCategories`, `CreateCategory`, `UpdateCategory`, `DeleteCategory` |
| `organizer.proto` | `organizer.v1` | `OrganizerService` | `ListOrganizers`, `GetOrganizer`, `CreateOrganizer`, `UpdateOrganizer`, `DeleteOrganizer` |
| `performer.proto` | `performer.v1` | `PerformerService` | `ListPerformers`, `GetPerformer`, `CreatePerformer`, `UpdatePerformer`, `DeletePerformer` |
| `screening.proto` | `screening.v1` | `ScreeningService` | `CreateScreening`, `GetScreenings`, `GetScreeningsByEvent`, `GetScreening`, `UpdateScreening`, `DeleteScreening` |
| `booking.proto` | `booking.v1` | `BookingService` | `GetUserBookings`, `CreateReservation`, `ConfirmBooking`, `CancelBooking`, `ListReservedSeats` |
| `payment.proto` | `payment.v1` | `PaymentService` | `CreatePayment`, `ProcessPaymentEvent`, `GetUserPaymentMethods`, `CreatePaymentMethod`, `VerifyPaymentMethod`, `DeletePaymentMethod` |
| `refund.proto` | `refund.v1` | `RefundService` | `CreateRefund`, `ProcessRefundEvent` |
| **`pricing.proto`** | `pricing.v1` | `PricingService` | `CalculatePrice` (главный), `SetPriceTemplate`, `GetPriceTemplate`, `SetSeatPriceOverride`, `DeleteSeatPriceOverride`, `CreatePricingRule`, `UpdatePricingRule`, `DeletePricingRule`, `ListPricingRules`, `CreatePromoCode`, `DeactivatePromoCode`, `CreateAudience`, `ListAudiences` — **новое** |

## Новый контракт: Pricing

`pricing.proto` — контракт для нового `pricing-service`. Главный метод — `CalculatePrice`, принимает `screening_id`/`sector_id`/`seat_id`/`user_id`/`audience_code`/`promo_code`/`quantity`/`purchase_date`, возвращает `base_price`/`discount`/`surcharge`/`final_price`/`rules`/`snapshot_id`. Остальные методы — административный CRUD для шаблонов цен, правил ценообразования (с вложенными `PricingRuleScopeInput`/`PricingRuleConditionInput`), промокодов и аудиторий. Подробности — в документации самого `pricing-service`.

## Breaking change: `price` убран из четырёх контрактов

С появлением `pricing-service` цена перестаёт быть статичным атрибутом места/раскладки/типа мест и становится результатом динамического расчёта. Поле `price` удалено из:

- **`seat.proto`**: сообщение `Seat` (было `id, row, number, price, status, type, sector_id` → стало без `price`).
- **`sector.proto`**: сообщение `RowLayout` (было `row, columns, type, price` → стало без `price`; раскладка теперь только про структуру, не про цену).
- **`screening.proto`**: сообщение `SeatType` (было `type, price` → стало только `type`).
- **`booking.proto`** и **`payment.proto`**: сообщение `SeatInput` (было `seat_id, price` → стало только `seat_id`) — вызывающая сторона (`gateway-service`) больше не передаёt цену при бронировании, её вычисляет `booking-service` через `Pricing.CalculatePrice`.

Это **breaking change для всех потребителей** этих сообщений — версия пакета поднята с `1.9.0` до `2.0.0`. Сервисы, уже перенесённые на новый контракт: `arena-service` (`Seat.price` убран полностью из БД/domain), `booking-service` (`Ticket.price` → `basePrice`/`finalPrice`/`pricingSnapshotId`). Подробности в их документации.

## Важные детали контрактов (сверено с реализацией сервисов)

- **`event.proto`: метод действительно называется `GetEvents`** (не `GetEvent`), несмотря на единичный ответ — осознанно так задано в контракте.
- **`account.proto`: `Role` enum** (`USER=0, ADMIN=1, EDITOR=2, CASHIER=3`) — порядковые номера менять нельзя, только добавлять новые в конец.
- **`sector.proto`: `SectorMode` enum** (`RESERVED=0, GENERAL_ADMISSION=1`) — `RESERVED`-секторы имеют конкретные места (`RowLayout`), `GENERAL_ADMISSION` — только `capacity` без мест (например, фан-зона). Режим неизменяем после создания — намеренно отсутствует в `UpdateSectorRequest`.

## ⚠️ Представление enum на wire-уровне — не гарантированно единообразно

При разработке `pricing-service` обнаружилось: то, как `@grpc/proto-loader` представляет значения proto3 `enum` в JS (число или строка-имя константы), зависит от опции `enums` в конфигурации загрузчика **конкретной стороны** (сервер/клиент), а не задаётся самим контрактом. Часть сервисов платформы настраивает `enums: String` явно (`arena-service`'s `main.ts`), часть полагается на конфигурацию по умолчанию через `@usteam/common`'s `GrpcModule` (без явного `loader`). При этом **`ts-proto` всегда генерирует числовые TS-типы** для enum-полей независимо от этой рантайм-конфигурации — то есть тип поля не гарантирует, что там реально окажется число.

Прямое сравнение входящего enum-значения с числовой константой (например, `data.mode === SectorModeProto.GENERAL_ADMISSION`) может **молча давать неверный результат** на стороне, где loader представил значение строкой. Это уже приводило к реальному багу в `gateway-service` (`RolesGuard` сравнивал роль без нормализации). Решение — новая утилита `protoEnumToDomain` в `@usteam/common`, устойчивая к обоим представлениям; используется на **входящей** стороне для всех enum-полей контрактов, где это уже обнаружено (`SectorMode`, `RuleType`, `ValueType`, `Role`). Полный аудит платформы на предмет остальных enum-полей (например, статусов в других контрактах) не проводился — это открытая задача.

## Асинхронные события (RabbitMQ, `src/events`)

| Интерфейс | Поля | Публикует | Потребляет |
|---|---|---|---|
| `OtpRequestedEvent` | `identifier, type, code` | `auth-service` | `notification-service` |
| `EmailChangedEvent` | `email, code` | `auth-service` | `notification-service` |
| `PhoneChangedEvent` | `phone, code` | `auth-service` | `notification-service` |

## Использование в сервисах

- **NestJS-сервисы** импортируют сгенерированные типы напрямую из подпутей пакета, например `@usteam/contracts/gen/ts/pricing`.
- **`PROTO_PATHS`** используется там, где gRPC-соединение строится вручную через `@grpc/proto-loader` (например, `bot-service`).
- **Go-сервис (`media-service`)** — единственный потребитель `gen/go`.

## Публикация

- **npm**: при пуше в `main` — `protoc`, `npm install`, `npm run build`, `npm run generate`, `npm publish`.
- **Go** — отдельный воркфлоу, генерация/публикация Go-модуля.

## Запуск/разработка локально

```bash
npm install
npm run generate     # protoc + ts-proto → gen/ts
npm run build          # tsc -p tsconfig.build.json → dist/
```

## История изменений

| Дата/повод | Что изменилось |
|---|---|
| Приватный SSH-ключ в репозитории | ✅ Удалён из рабочей копии, `.gitignore` дополнен паттернами приватных ключей |
| Устаревший `dist/` в архиве | ✅ Удалён |
| `users.proto`: скопированный комментарий над `PatchUser` | ✅ Исправлен |
| `account.proto`: опечатка `Responce` → `Response` (4 сообщения) | ✅ Исправлено, синхронно обновлён `auth-service` |
| Отсутствовал `README.md` | ✅ Добавлен |
| Добавлены `organizer.proto`/`performer.proto` | ✅ Версия `1.7.0` |
| `event.proto` дополнен `organizer_id`/`performer_ids` (+`PerformerIdList`) | ✅ Версия `1.8.0` |
| `sector.proto`: добавлены `SectorMode`, `capacity`, `rpc GetSectorWithSeats` | ✅ Версия `1.9.0` |
| **Появление `pricing-service`**: новый `pricing.proto`; `price` убран из `seat.proto`/`sector.proto` (`RowLayout`)/`screening.proto` (`SeatType`)/`booking.proto`+`payment.proto` (`SeatInput`) | ✅ Версия `2.0.0` (breaking change) |
