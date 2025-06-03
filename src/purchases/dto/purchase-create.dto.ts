import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class PurchaseCreateDto {
  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  amount: number;
}
