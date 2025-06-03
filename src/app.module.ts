import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UserModule } from './users/user.module';
import { RewardsModule } from './rewards/rewards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PurchasesModule } from './purchases/purchases.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      csrfPrevention: false,
    }),
    ConfigModule.forRoot({
      load: [typeorm],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('typeorm'),
      }),
      async dataSourceFactory(option) {
        if (!option) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(option));
      },
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    UserModule,
    RewardsModule,
    TransactionsModule,
    PurchasesModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
