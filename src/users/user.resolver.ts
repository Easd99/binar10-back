import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') input: UserCreateDto) {
    return this.userService.create(input);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') input: UserUpdateDto) {
    return this.userService.update(input);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.delete(id);
  }

  @Query(() => Int)
  getUserPoints(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUserPoints(id);
  }
}
