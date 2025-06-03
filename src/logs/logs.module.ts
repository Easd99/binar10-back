import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';
import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogsService, LogsResolver],
  exports: [LogsService], // 🚀 importante para que otros módulos puedan usar LogService
})
export class LogsModule {}
