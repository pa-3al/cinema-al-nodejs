import { Module, Global } from '@nestjs/common';
import { SecretService } from './secret.service';
import { SECRET_PORT } from '../../../core/domain/global/token';

@Global()
@Module({
    providers: [
        { provide: SECRET_PORT, useClass: SecretService },
    ],
    exports: [SECRET_PORT],
})
export class SecretModule {}