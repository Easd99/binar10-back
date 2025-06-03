import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateDto {
  @Field()
  name: string;
}
