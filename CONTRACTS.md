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
proto/                      # единственный источник истины — .proto-файлы всех сервисов
├── auth.proto                 # auth-service: OTP, refresh, Telegram-флоу
├── account.proto                # auth-service: аккаунт, смена email/телефона, Role enum
├── users.proto                    # users-service: профиль (GetMe/CreateUser/PatchUser)
├── media.proto                      # media-service: Upload/Get/Delete файлов в S3
├── arena.proto                        # arena-service: CRUD арен
├── sector.proto                         # arena-service: CRUD секторов + RowLayout
├── seat.proto                             # arena-service: чтение мест
├── event.proto                              # event-service: CRUD событий
├── category.proto                             # event-service: CRUD категорий
├── organizer.proto                              # event-service (план): CRUD организаторов — новое
├── performer.proto                                # event-service (план): CRUD исполнителей — новое
├── screening.proto                                  # screening-service: CRUD сеансов
├── booking.proto                                      # booking-service: брони, билеты
├── payment.proto                                        # payment-service: платежи, методы оплаты
└── refund.proto                                            # payment-service: возвраты

gen/
├── ts/                     # генерируется при publish (npm run generate), в репозитории пусто (только .gitkeep)
└── go/media/                # сгенерированные Go-типы для media.proto (единственный закоммиченный gen-код)

src/
├── proto/
│   ├── paths.ts               # PROTO_PATHS — абсолютные пути ко всем .proto-файлам, включая ORGANIZER/PERFORMER
│   └── index.ts
├── events/
│   ├── auth/otp-requested.interface.ts     # OtpRequestedEvent {identifier, type, code}
│   ├── account/email-changed.ts              # EmailChangedEvent {email, code}
│   ├── account/phone-changed.ts                # PhoneChangedEvent {phone, code}
│   └── index.ts
└── index.ts                 # экспортирует и proto, и events

scripts/generate_go.sh     # генерация Go-кода конкретно для media.proto
README.md                   # добавлен — краткая инструкция по установке/генерации/добавлению контрактов
```

`dist/` больше не хранится в рабочей копии пакета (см. историю изменений) — он и так был в `.gitignore` и пересобирается перед каждой публикацией в CI.

## gRPC-сервисы по `.proto`-файлам

| Файл | Пакет | Сервис | Методы |
|---|---|---|---|
| `auth.proto` | `auth.v1` | `AuthService` | `SendOtp`, `VerifyOtp`, `Refresh`, `TelegramInit`, `TelegramVerify`, `TelegramComplete`, `TelegramConsume` |
| `account.proto` | `account.v1` | `AccountService` | `GetAccount`, `InitEmailChange`, `ConfirmEmailChange`, `InitPhoneChange`, `ConfirmPhoneChange`; enum `Role {USER, ADMIN, EDITOR, CASHIER}` |
| `users.proto` | `users.v1` | `UsersService` | `GetMe`, `CreateUser`, `PatchUser` |
| `media.proto` | `media.v1` | `MediaService` | `Upload`, `Get`, `Delete` |
| `arena.proto` | `arena.v1` | `ArenaService` | `ListArenas`, `GetArena`, `CreateArena`, `UpdateArena`, `DeleteArena` |
| `sector.proto` | `sector.v1` | `SectorService` | `CreateSector`, `GetSector`, `ListSectorsByArena`, `UpdateSector`, `DeleteSector` |
| `seat.proto` | `seat.v1` | `SeatService` | `GetSeat`, `ListSeatsBySector` |
| `event.proto` | `event.v1` | `EventService` | `ListEvents`, `GetEvents`, `CreateEvent`, `UpdateEvent`, `DeleteEvent` |
| `category.proto` | `category.v1` | `CategoryService` | `GetAllCategories`, `CreateCategory`, `UpdateCategory`, `DeleteCategory` |
| **`organizer.proto`** | `organizer.v1` | `OrganizerService` | `ListOrganizers`, `GetOrganizer`, `CreateOrganizer`, `UpdateOrganizer`, `DeleteOrganizer` — **новое** |
| **`performer.proto`** | `performer.v1` | `PerformerService` | `ListPerformers`, `GetPerformer`, `CreatePerformer`, `UpdatePerformer`, `DeletePerformer` — **новое** |
| `screening.proto` | `screening.v1` | `ScreeningService` | `CreateScreening`, `GetScreenings`, `GetScreeningsByEvent`, `GetScreening`, `UpdateScreening`, `DeleteScreening` |
| `booking.proto` | `booking.v1` | `BookingService` | `GetUserBookings`, `CreateReservation`, `ConfirmBooking`, `CancelBooking`, `ListReservedSeats` |
| `payment.proto` | `payment.v1` | `PaymentService` | `CreatePayment`, `ProcessPaymentEvent`, `GetUserPaymentMethods`, `CreatePaymentMethod`, `VerifyPaymentMethod`, `DeletePaymentMethod` |
| `refund.proto` | `refund.v1` | `RefundService` | `CreateRefund`, `ProcessRefundEvent` |

## Новые контракты: Organizer и Performer

Оба добавлены по образцу `arena.proto` (полный CRUD + получение по id + список), с идентичной структурой полей — организаторы и исполнители моделируются одинаково:

```proto
message Organizer {   // и, аналогично, Performer
    string id          = 1;
    string title       = 2;
    string description = 3;
    string image        = 4;
}
```

- **Методы**: `Create*`, `Update*`, `Get*` (по id), `Delete*`, `List*` — везде обёртки-обёртки `*Request`/`*Response`, как в `arena.proto`, а не "голые" сообщения напрямую в `rpc`, для единообразия и возможности расширения запроса в будущем без breaking change.
- **Пакеты**: `organizer.v1`, `performer.v1` — отдельные от `event.v1`/`category.v1`, хотя по плану обе сущности будут жить в `event-service` (аналогично тому, как `arena.v1`/`sector.v1`/`seat.v1` — три разных пакета, отдаваемых одним `arena-service`).
- Добавлены в `PROTO_PATHS` (`ORGANIZER`, `PERFORMER`), рядом с `EVENT`/`CATEGORY`.
- **Не добавлены** (пока, до появления реализации в `event-service`): регистрация в реестре `GRPC_CLIENTS` пакета `@usteam/common` — это отдельный npm-пакет, туда нужен отдельный проход после того, как `event-service` реализует эти контракты (см. раздел "Требует внимания" ниже).

## Важные детали контрактов (сверено с реализацией сервисов)

- **`event.proto`: метод действительно называется `GetEvents`** (не `GetEvent`), несмотря на то, что запрос/ответ единичные (`GetEventRequest → GetEventResponse`, с полем `event`, не `events`). Это осознанно так задано в самом контракте, а не баг сервиса.
- **`seat.proto`: сообщение `Seat` не содержит `x`/`y`** (координаты места) — только `id, row, number, price, status, type, sector_id`. В `arena-service` эти координаты есть в Prisma-модели, но по контракту наружу не отдаются.
- **`seat.proto`: `Seat.status`** — вычисляемое поле, заполняется только в `ListSeatsUsecase` (`arena-service`) после сверки с `booking-service`; у `GetSeat` такого обогащения нет.
- **`screening.proto`: поле называется `seat_type`** (единственное число) — camelCase `seatType`, а не `seatTypes`.
- **`media.proto` определяет `Get` и `Delete`** как полноценные RPC-методы — контракт ожидает их, `media-service` пока реализует только `Upload`.
- **`booking.proto`/`payment.proto`: сообщение `SeatInput` продублировано** в обоих файлах с идентичной структурой (`seat_id`, `price`) — независимые пакеты, синхронизировать вручную при изменениях.
- **`account.proto`: `Role` enum** (`USER=0, ADMIN=1, EDITOR=2, CASHIER=3`) — порядковые номера менять нельзя, только добавлять новые в конец.

## Асинхронные события (RabbitMQ, `src/events`)

| Интерфейс | Поля | Публикует | Потребляет |
|---|---|---|---|
| `OtpRequestedEvent` | `identifier, type, code` | `auth-service` (`auth.otp.requested`) | `notification-service` |
| `EmailChangedEvent` | `email, code` | `auth-service` (`account.email.changed`) | `notification-service` |
| `PhoneChangedEvent` | `phone, code` | `auth-service` (`account.phone.changed`) | `notification-service` |

Это обычные TS-интерфейсы (не protobuf/AsyncAPI) — типобезопасность обеспечивается только на уровне TypeScript-компиляции внутри каждого сервиса, где эти типы явно импортируются; сам по себе брокер (RabbitMQ) формат сообщения не проверяет.

## Использование в сервисах

- **NestJS-сервисы** импортируют сгенерированные типы напрямую из подпутей пакета, например `@usteam/contracts/gen/ts/arena`, `@usteam/contracts/gen/ts/account` — типы, сгенерированные `ts-proto`, физически появляются в пакете только после `npm run generate` на этапе публикации (в самом репозитории `gen/ts` пуст).
- **`PROTO_PATHS`** используется там, где gRPC-соединение строится вручную через `@grpc/proto-loader` (`loadSync`) вместо декларативного `ClientsModule` NestJS — например, в `bot-service`.
- **Go-сервис (`media-service`)** импортирует пакет как `github.com/ShmatkoBrest/contracts/gen/go/media` — только *media*, так как Go-генерация настроена исключительно на `media.proto`.

## Публикация

- **npm** (`.github/workflows/publish-npm.yml`): при пуше в `main` — установка `protoc`, `npm install`, `npm run build`, `npm run generate`, `npm publish`.
- **Go** (`.github/workflows/publish-go.yml`) — отдельный воркфлоу, генерация/публикация Go-модуля.

## Запуск/разработка локально

```bash
npm install
npm run generate     # protoc + ts-proto → gen/ts (требует установленного protoc)
npm run build          # tsc -p tsconfig.build.json → dist/
```

Для Go-части:
```bash
./scripts/generate_go.sh    # регенерирует gen/go для media.proto
```

## История изменений

| Замечание | Статус |
|---|---|
| **Приватный SSH-ключ в репозитории** (`git push`/`git push.pub`) | ✅ Файлы удалены из рабочей копии. В `.gitignore` добавлены паттерны приватных ключей (`id_rsa`, `id_ed25519`, `*.pem`, `*.key` и т.п.), чтобы это не повторилось. **⚠️ Требует ручного действия, которое я не могу выполнить**: удаление файла из истории git недостаточно — нужно вычистить историю (`git filter-repo`/BFG) и **отозвать сам ключ** везде, где он мог быть авторизован (серверы, deploy keys, CI-секреты), поскольку он уже считается скомпрометированным. |
| Устаревший `dist/` в архиве (расходился с `src`, хотя и так в `.gitignore`) | ✅ Удалён из рабочей копии — пересобирается в CI перед каждой публикацией. |
| `users.proto`: комментарий над `PatchUser` дословно скопирован с `CreateUser` | ✅ Исправлено — заменён на корректное описание метода. |
| `account.proto`: опечатка `Responce` вместо `Response` в четырёх именах сообщений | ✅ Исправлено во всех четырёх местах (`InitEmailChangeResponse`, `ConfirmEmailChangeResponse`, `InitPhoneChangeResponse`, `ConfirmPhoneChangeResponse`). Это переименование сгенерированных TS-типов, поэтому синхронно обновлён единственный найденный потребитель по имени типа — `auth-service` (`src/modules/account/account.controller.ts`). `gateway-service` и остальные сервисы явных ссылок на эти имена типов не содержат — их не потребовалось трогать. |
| Отсутствовал `README.md` пакета | ✅ Добавлен — установка, генерация, структура, порядок добавления нового контракта, предупреждения про breaking changes. |
| Go-генерация закоммичена только для `media.proto` | ℹ️ Не менялось — актуально только при появлении новых Go-сервисов. |

## Новое: добавлены контракты Organizer и Performer

- `proto/organizer.proto`, `proto/performer.proto` — см. раздел выше.
- `PROTO_PATHS` дополнен полями `ORGANIZER`, `PERFORMER`.
- Версия пакета поднята: `1.6.6` → `1.7.0`.

## Требует внимания перед использованием

- **Регистрация в `@usteam/common`**: `GRPC_CLIENTS`-реестр (`lib/grpc/registry/grpc.registry.ts` в пакете `@usteam/common`) пока **не** содержит записей `ORGANIZER_PACKAGE`/`PERFORMER_PACKAGE`. Это отдельный npm-пакет — правки в него не входили в объём этой задачи (только `contracts`). Добавить туда записи стоит одновременно с реализацией `event-service`, аналогично тому, как там уже сделано для `EVENT_PACKAGE`/`CATEGORY_PACKAGE` (тот же `EVENT_GRPC_URL`).
- **Реализация в `event-service`**: контракты добавлены только на уровне `.proto` — самого `OrganizerService`/`PerformerService` в `event-service` (и в `gateway-service` как HTTP-обёртки) пока нет. Контракт — это форма, реализация ожидается отдельным шагом, когда до этого дойдёт очередь по плану рефакторинга `event-service`.
- **`npm run generate`/`npm run build` не выполнялись** — как и раньше, для проверки актуальности сгенерированных типов нужен локальный `protoc` и реальный прогон. Синтаксис `.proto`-файлов не проверен парсером `protoc`, только вручную по аналогии с существующими файлами.
- **Отзыв скомпрометированного SSH-ключа** — см. таблицу выше, единственное действие, требующее ручного вмешательства вне кода.
