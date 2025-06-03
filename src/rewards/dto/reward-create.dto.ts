import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateRewardInput {
  @Field()
  name: string;

  @Field(() => Int)
  pointsCost: number;
}
