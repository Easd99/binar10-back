import { Resolver, Query, Args } from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { Log } from './log.schema';

@Resolver(() => Log)
export class LogsResolver {
  constructor(private readonly logService: LogsService) {}

  @Query(() => [Log], { name: 'getLogs' })
  findAll() {
    return this.logService.findAll();
  }

  @Query(() => Log, { name: 'getLog' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.logService.findOne(id);
  }
}
