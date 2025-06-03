import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateRewardInput {
  @Field(() => Int)
  id: number;

  @Field()
  name?: string;

  @Field(() => Int)
  pointsCost?: number;
}
