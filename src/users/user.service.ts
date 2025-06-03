import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { LogsService } from '../logs/logs.service';
import { LogAction } from '../logs/enums/log.enum';
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    private readonly logsService: LogsService,
  ) {}

  @Transactional()
  async create(input: UserCreateDto): Promise<User> {
    try {
      const user = this.userRepository.create(input);
      await this.logsService.create({
        action: LogAction.CREATE_USER,
        detail: `User ${input.name} registered successfully.`,
      });
      return this.userRepository.save(user);
    } catch (e: any) {
      await this.logsService.create({
        action: LogAction.CREATE_USER,
        detail: `Error registering user: ${e.message}`,
      });
      throw e;
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  @Transactional()
  async update(input: UserUpdateDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: input.id },
      });
      if (input.name) {
        user.name = input.name;
      }
      await this.logsService.create({
        action: LogAction.UPDATE_USER,
        detail: `User with ID ${input.id} updated successfully.`,
      });

      return await this.userRepository.save({
        ...user,
      });
    } catch (e) {
      await this.logsService.create({
        action: LogAction.UPDATE_USER,
        detail: `Error updating user with ID ${input.id}: ${e.message}`,
      });
      throw e;
    }
  }

  @Transactional()
  async delete(id: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      await this.userRepository.softRemove(user);
      await this.logsService.create({
        action: LogAction.DELETE_USER,
        detail: `User with ID ${id} deleted successfully.`,
      });
      return true;
    } catch (e) {
      await this.logsService.create({
        action: LogAction.DELETE_USER,
        detail: `Error deleting user with ID ${id}: ${e.message}`,
      });
      throw e;
    }
  }

  async getUserPoints(userId: number): Promise<number> {
    const transactions = await this.transactionsService.findAll(userId);

    let total = 0;
    for (const tx of transactions) {
      if (tx.type === 'earn') total += tx.points;
      else if (tx.type === 'redeem') total -= tx.points;
    }

    return total;
  }
}
