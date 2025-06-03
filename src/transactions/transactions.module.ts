import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionResolver } from './transaction.resolver';
import { UserModule } from '../users/user.module';
import { RewardsModule } from '../rewards/rewards.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => UserModule),
    RewardsModule,
    LogsModule,
  ],
  providers: [TransactionsService, TransactionResolver],
  exports: [TransactionsService],
})
export class TransactionsModule {}
