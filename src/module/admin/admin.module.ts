import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';

@Module({
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
  exports: [AdminService],
  imports: [forwardRef(() => AuthModule), ProjectModule],
})
export class AdminModule {}
