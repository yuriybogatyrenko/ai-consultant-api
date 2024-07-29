import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/billing-payment.entity';
import { Subscription } from './entity/billing-subscription.entity';
import { Plan } from './entity/billing-plan.entity';
import { PaymentsController } from './payments.controller';
import { PlansController } from './plans.controller';
import { SubscriptionsController } from './subscriptions.controller';
import { PaymentsService } from './payments.service';
import { PlansService } from './plans.service';
import { SubscriptionsService } from './subscriptions.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Subscription, Plan]),
    AuthModule,
  ],
  providers: [PaymentsService, PlansService, SubscriptionsService],
  controllers: [PaymentsController, PlansController, SubscriptionsController],
  exports: [PaymentsService, PlansService, SubscriptionsService],
})
export class BillingModule {}
