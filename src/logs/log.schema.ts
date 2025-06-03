// src/logs/log.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LogAction } from './enums/log.enum';

@ObjectType()
@Schema({ timestamps: true })
export class Log extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => LogAction)
  @Prop({ enum: LogAction, required: true })
  action: LogAction;

  @Field()
  @Prop()
  detail: string;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
