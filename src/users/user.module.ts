import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { TransactionsModule } from '../transactions/transactions.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  providers: [UserService, UserResolver],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TransactionsModule),
    LogsModule,
  ],
  exports: [UserService],
})
export class UserModule {}
