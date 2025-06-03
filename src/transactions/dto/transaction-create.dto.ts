import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class TransactionCreateDto {
  @Field(() => Int)
  userId: number;

  @Field()
  type: 'earn' | 'redeem';

  @Field(() => Int)
  points: number;

  @Field({ nullable: true })
  date?: Date;
}
