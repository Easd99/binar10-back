import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { UpdatePurchaseInput } from './dto/purchase-update.dto';
import { User } from '../users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { TransactionsService } from '../transactions/transactions.service';
import { LogsService } from '../logs/logs.service';
import { LogAction } from '../logs/enums/log.enum';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly transactionsService: TransactionsService,
    private readonly logsService: LogsService,
  ) {}

  @Transactional()
  async create(input: PurchaseCreateDto): Promise<Purchase> {
    try {
      const user = await this.userRepository.findOneBy({
        id: input.userId,
      });
      if (!user) throw new NotFoundException('user not found');

      const purchase = this.purchaseRepository.create({
        user,
        amount: input.amount,
        date: new Date(),
      });

      const points = Math.floor(input.amount / 1000);

      await this.transactionsService.create({
        userId: input.userId,
        type: 'earn',
        points,
        date: new Date(),
      });

      await this.logsService.create({
        action: LogAction.REGISTER_PURCHASE,
        detail: `Purchase of ${input.amount} registered, earning ${points} points.`,
      });

      return await this.purchaseRepository.save(purchase);
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.REGISTER_PURCHASE,
        detail: `Error registering purchase: ${e.message}`,
      });
      throw e;
    }
  }

  findAll(): Promise<Purchase[]> {
    return this.purchaseRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Purchase> {
    return this.purchaseRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  @Transactional()
  async update(updatePurchaseInput: UpdatePurchaseInput): Promise<Purchase> {
    try {
      const purchase = await this.purchaseRepository.findOne({
        where: { id: updatePurchaseInput.id },
        relations: ['user'],
      });
      if (!purchase) throw new NotFoundException('purchase not found');

      if (updatePurchaseInput.amount !== undefined) {
        purchase.amount = updatePurchaseInput.amount;
      }
      if (updatePurchaseInput.date !== undefined) {
        purchase.date = updatePurchaseInput.date;
      }
      if (updatePurchaseInput.userId !== undefined) {
        const user = await this.userRepository.findOneBy({
          id: updatePurchaseInput.userId,
        });
        if (!user) throw new NotFoundException('User not found');
        purchase.user = user;
      }

      await this.logsService.create({
        action: LogAction.UPDATE_PURCHASE,
        detail: `Purchase with ID ${purchase.id} updated.`,
      });

      return this.purchaseRepository.save(purchase);
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.UPDATE_PURCHASE,
        detail: `Error updating purchase: ${e.message}`,
      });
      throw e;
    }
  }

  @Transactional()
  async remove(id: number): Promise<boolean> {
    try {
      const purchase = await this.purchaseRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!purchase) new NotFoundException('purchase not found');

      await this.purchaseRepository.remove(purchase);

      await this.logsService.create({
        action: LogAction.DELETE_PURCHASE,
        detail: `Purchase with ID ${id} deleted.`,
      });

      return true;
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.DELETE_PURCHASE,
        detail: `Error deleting purchase: ${e.message}`,
      });
      throw e;
    }
  }
}
