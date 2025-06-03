// src/rewards/reward.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { RewardService } from './rewards.service';
import { RewardResolver } from './reward.resolver';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reward]), LogsModule],
  providers: [RewardService, RewardResolver],
  exports: [RewardService],
})
export class RewardsModule {}
