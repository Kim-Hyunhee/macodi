import { Module } from '@nestjs/common';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { SceneRepository } from './scene.repository';
import { ProjectModule } from '../project/project.module';

@Module({
  providers: [SceneService, SceneRepository],
  controllers: [SceneController],
  imports: [ProjectModule],
  exports: [SceneService],
})
export class SceneModule {}
