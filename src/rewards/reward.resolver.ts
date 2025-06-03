// src/rewards/reward.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RewardService } from './rewards.service';
import { Reward } from './entities/reward.entity';
import { CreateRewardInput } from './dto/reward-create.dto';
import { UpdateRewardInput } from './dto/reward-update.dto';

@Resolver(() => Reward)
export class RewardResolver {
  constructor(private readonly rewardService: RewardService) {}

  @Mutation(() => Reward)
  createReward(
    @Args('createRewardInput') createRewardInput: CreateRewardInput,
  ) {
    return this.rewardService.create(createRewardInput);
  }

  @Query(() => [Reward], { name: 'getRewards' })
  findAll() {
    return this.rewardService.findAll();
  }

  @Query(() => Reward, { name: 'getReward' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rewardService.findOne(id);
  }

  @Mutation(() => Reward)
  updateReward(
    @Args('updateRewardInput') updateRewardInput: UpdateRewardInput,
  ) {
    return this.rewardService.update(updateRewardInput);
  }

  @Mutation(() => Boolean)
  removeReward(@Args('id', { type: () => Int }) id: number) {
    return this.rewardService.remove(id);
  }
}
