import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { CreateRewardInput } from './dto/reward-create.dto';
import { UpdateRewardInput } from './dto/reward-update.dto';
import { LogsService } from '../logs/logs.service';
import { LogAction } from '../logs/enums/log.enum';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    private readonly logsService: LogsService,
  ) {}

  @Transactional()
  async create(createRewardInput: CreateRewardInput): Promise<Reward> {
    try {
      const reward = this.rewardRepository.create(createRewardInput);
      await this.logsService.create({
        action: LogAction.CREATE_REWARD,
        detail: `Reward created: ${createRewardInput.name} with cost ${createRewardInput.pointsCost} points.`,
      });
      return this.rewardRepository.save(reward);
    } catch (e) {
      await this.logsService.create({
        action: LogAction.CREATE_REWARD,
        detail: `Error creating reward: ${e.message}`,
      });
      throw e;
    }
  }

  findAll(): Promise<Reward[]> {
    return this.rewardRepository.find();
  }

  findOne(id: number): Promise<Reward> {
    return this.rewardRepository.findOneBy({ id });
  }

  @Transactional()
  async update(input: UpdateRewardInput): Promise<Reward> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id: input.id },
      });
      if (input.name) {
        reward.name = input.name;
      }
      if (input.pointsCost) {
        reward.pointsCost = input.pointsCost;
      }
      await this.logsService.create({
        action: LogAction.UPDATE_REWARD,
        detail: `Reward updated: ${reward.name} with new cost ${reward.pointsCost} points.`,
      });
      return await this.rewardRepository.save({
        ...reward,
      });
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.UPDATE_REWARD,
        detail: `Error updating reward: ${e.message}`,
      });
      throw e;
    }
  }

  @Transactional()
  async remove(id: number): Promise<boolean> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id },
      });
      if (!reward) {
        throw new NotFoundException('reward not found');
      }
      await this.rewardRepository.softRemove(reward);
      await this.logsService.create({
        action: LogAction.DELETE_REWARD,
        detail: `Reward with ID ${reward.id} deleted.`,
      });
      return true;
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.DELETE_REWARD,
        detail: `Error deleting reward: ${e.message}`,
      });
      throw e;
    }
  }
}
