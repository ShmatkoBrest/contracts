import { join } from "path";

export const PROTO_PATHS = {
    AUTH: join(__dirname, '../../proto/auth.proto'),
    ACCOUNT: join(__dirname, '../../proto/account.proto'),
    USERS: join(__dirname, '../../proto/users.proto'),
    MEDIA: join(__dirname, '../../proto/media.proto'),
    EVENT: join(__dirname, '../../proto/event.proto'),
    CATEGORY: join(__dirname, '../../proto/category.proto'),
    ARENA: join(__dirname, '../../proto/arena.proto'),
    SECTOR: join(__dirname, '../../proto/sector.proto'),
    SEAT: join(__dirname, '../../proto/seat.proto'),

} as const