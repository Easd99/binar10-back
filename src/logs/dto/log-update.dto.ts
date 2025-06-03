import { InputType, Field } from '@nestjs/graphql';
import { LogAction } from "../enums/log.enum";

@InputType()
export class LogUpdateDto {
  @Field()
  id: string;

  @Field(() => LogAction)
  action?: LogAction;

  @Field()
  detail?: string;
}
