import { join } from "path";

export const PROTO_PATHS = {
    AUTH: join(__dirname, '../../proto/auth.proto'),
    ACCOUNT: join(__dirname, '../../proto/account.proto'),
    USERS: join(__dirname, '../../proto/users.proto'),
    MEDIA: join(__dirname, '../../proto/media.proto')
} as const