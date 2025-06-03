import { InputType, Field } from '@nestjs/graphql';
import { LogAction } from '../enums/log.enum';

@InputType()
export class LogCreateDto {
  @Field(() => LogAction)
  action: LogAction;

  @Field()
  detail: string;
}
