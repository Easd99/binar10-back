import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';
import { LogCreateDto } from './dto/log-create.dto';
import { LogUpdateDto } from './dto/log-update.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async create(createLogInput: LogCreateDto): Promise<Log> {
    return this.logModel.create({
      ...createLogInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Log> {
    return this.logModel.findById(id).exec();
  }

  async update(updateLogInput: LogUpdateDto): Promise<Log> {
    return this.logModel
      .findByIdAndUpdate(
        updateLogInput.id,
        {
          ...updateLogInput,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.logModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
