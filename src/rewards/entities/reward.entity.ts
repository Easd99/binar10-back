import {
  ObjectType,
  Field,
  ID,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('rewards')
export class Reward {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'name' })
  name: string;

  @Field(() => Int)
  @Column({ name: 'points_cost' })
  pointsCost: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
