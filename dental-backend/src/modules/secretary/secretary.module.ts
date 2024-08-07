import { Module, forwardRef } from '@nestjs/common';
import { SecretaryController } from './secretary.controller';
import { AppContextModule } from 'src/prisma/prisma.module';
import { SecretaryService } from './secretary.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AppContextModule, forwardRef(() => AuthModule)],
  controllers: [SecretaryController],
  providers: [SecretaryService],
  exports: [SecretaryService],
})
export class SecretaryModule {}
