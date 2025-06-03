import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseService } from './purchases.service';
import { PurchaseResolver } from './purchase.resolver';
import { User } from '../users/entities/user.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User]),
    TransactionsModule,
    LogsModule,
  ],
  providers: [PurchaseService, PurchaseResolver],
  exports: [PurchaseService],
})
export class PurchasesModule {}
