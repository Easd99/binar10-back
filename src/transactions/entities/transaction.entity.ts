import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, JoinColumn
} from "typeorm";
import { ObjectType, Field, ID, Int, GraphQLISODateTime } from "@nestjs/graphql";
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: 'earn' | 'redeem';

  @Field(() => Int)
  @Column('int')
  points: number;

  @Field()
  @Column()
  date: Date;

  @Field(() => User)
  @ManyToOne(() => User, (x) => x.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
