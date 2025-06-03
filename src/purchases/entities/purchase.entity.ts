import {
  ObjectType,
  Field,
  ID,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('purchases')
export class Purchase {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (x) => x.purchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Float)
  @Column('float')
  amount: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @Field()
  @Column()
  date: Date;
}
