import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdatePurchaseInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  amount: number;

  @Field()
  date: Date;
}
