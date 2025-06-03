import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { Transactional } from 'typeorm-transactional';
import { RewardService } from '../rewards/rewards.service';
import { UserService } from '../users/user.service';
import { LogsService } from '../logs/logs.service';
import { LogAction } from '../logs/enums/log.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly rewardService: RewardService,
    private readonly logsService: LogsService,
  ) {}

  @Transactional()
  async create(
    createTransactionInput: TransactionCreateDto,
  ): Promise<Transaction> {
    try {
      const user = await this.userService.findOneById(
        createTransactionInput.userId,
      );
      if (!user) throw new NotFoundException('user not found');

      const transaction = this.transactionRepository.create({
        user,
        type: createTransactionInput.type,
        points: createTransactionInput.points,
        date: createTransactionInput.date || new Date(),
      });

      await this.logsService.create({
        action: LogAction.POINTS,
        detail: `Transaction of type ${createTransactionInput.type} with ${createTransactionInput.points} points created for user ${user.id}.`,
      });

      return this.transactionRepository.save(transaction);
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.POINTS,
        detail: `Error creating transaction: ${e.message}`,
      });
      throw e;
    }
  }

  async findAll(userId?: number): Promise<Transaction[]> {
    const whereCondition = userId ? { user: { id: userId } } : {};

    return this.transactionRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }

  @Transactional()
  async redeemPoints(userId: number, rewardId: number): Promise<Transaction> {
    try {
      const user = await this.userService.findOneById(userId);
      if (!user) throw new NotFoundException('user not found');

      const reward = await this.rewardService.findOne(rewardId);
      if (!reward) throw new NotFoundException('reward not found');

      const currentPoints = await this.userService.getUserPoints(userId);

      if (currentPoints < reward.pointsCost) {
        throw new BadRequestException('not enough points');
      }

      return await this.create({
        userId: userId,
        type: 'redeem',
        points: reward.pointsCost,
        date: new Date(),
      });
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.REDEEM_POINTS,
        detail: `Error redeeming points for user ${userId}: ${e.message}`,
      });
      throw e;
    }
  }

  async getUserHistory(userId: number): Promise<Transaction[]> {
    return this.findAll(userId);
  }
}
