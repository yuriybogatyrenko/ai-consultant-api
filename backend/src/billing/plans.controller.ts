import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlansService } from './plans.service';
import { Plan } from './entity/billing-plan.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Post()
  create(@Body() plan: Plan): Promise<Plan> {
    return this.plansService.create(plan);
  }
}
