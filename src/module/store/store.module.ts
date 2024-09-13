import { Module, forwardRef } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { AuthModule } from '../auth/auth.module';
import { AligoModule } from '../aligo/aligo.module';

@Module({
  providers: [StoreService, StoreRepository],
  controllers: [StoreController],
  imports: [forwardRef(() => AuthModule), AligoModule],
  exports: [StoreService],
})
export class StoreModule {}
