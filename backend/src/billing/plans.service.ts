import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Plan } from './entity/billing-plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  findAll(): Promise<Plan[]> {
    return this.plansRepository.find();
  }

  async findOne(planId: string): Promise<Plan> {
    const plan = await this.plansRepository.findOneBy({ plan_id: planId });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }
    return plan;
  }

  async create(plan: Plan): Promise<Plan> {
    return await this.plansRepository.save(plan);
  }

  async update(planId: string, updatedPlan: Partial<Plan>): Promise<Plan> {
    await this.plansRepository.update(planId, updatedPlan);
    const plan = await this.plansRepository.findOneBy({ plan_id: planId });
    if (!plan) {
      throw new NotFoundException(
        `Plan with ID ${planId} not found after update`,
      );
    }
    return plan;
  }

  async delete(planId: string): Promise<void> {
    const deleteResult = await this.plansRepository.delete(planId);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }
  }
}
