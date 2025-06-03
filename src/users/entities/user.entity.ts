import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Purchase } from '../../purchases/entities/purchase.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { default: 'user' })
  name: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  //transaction relation
  @OneToMany(() => Transaction, (x) => x.user)
  transactions: Transaction[];

  //transaction relation
  @OneToMany(() => Purchase, (x) => x.user)
  purchases: Purchase[];
}
