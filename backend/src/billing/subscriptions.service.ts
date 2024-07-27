import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entity/billing-subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  createSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create(
      createSubscriptionDto,
    );
    return this.subscriptionsRepository.save(subscription);
  }

  findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find();
  }

  findOne(subscription_id: string): Promise<Subscription> {
    return this.subscriptionsRepository.findOneBy({ subscription_id });
  }

  updateSubscription(id: number, updateSubscriptionDto: any): Promise<any> {
    return this.subscriptionsRepository.update(id, updateSubscriptionDto);
  }
}
