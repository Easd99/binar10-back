import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Mutation(() => Transaction, { name: 'redeemPoints' })
  redeemPoints(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('rewardId', { type: () => Int }) rewardId: number,
  ) {
    return this.transactionsService.redeemPoints(userId, rewardId);
  }

  @Query(() => [Transaction], { name: 'getUserHistory' })
  getUserHistory(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
  ) {
    return this.transactionsService.findAll(userId);
  }
}
