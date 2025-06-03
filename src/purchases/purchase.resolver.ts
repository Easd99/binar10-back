// src/purchases/purchase.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PurchaseService } from './purchases.service';
import { Purchase } from './entities/purchase.entity';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { UpdatePurchaseInput } from './dto/purchase-update.dto';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Mutation(() => Purchase)
  registerPurchase(
    @Args('createPurchaseInput') createPurchaseInput: PurchaseCreateDto,
  ) {
    return this.purchaseService.create(createPurchaseInput);
  }

  @Query(() => [Purchase], { name: 'getPurchases' })
  findAll() {
    return this.purchaseService.findAll();
  }

  @Query(() => Purchase, { name: 'getPurchase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.purchaseService.findOne(id);
  }

  @Mutation(() => Purchase)
  updatePurchase(
    @Args('updatePurchaseInput') updatePurchaseInput: UpdatePurchaseInput,
  ) {
    return this.purchaseService.update(updatePurchaseInput);
  }

  @Mutation(() => Boolean)
  removePurchase(@Args('id', { type: () => Int }) id: number) {
    return this.purchaseService.remove(id);
  }
}
