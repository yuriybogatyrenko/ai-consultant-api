import { Injectable } from '@nestjs/common';
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

  findOne(plan_id: string): Promise<Plan> {
    return this.plansRepository.findOneBy({ plan_id });
  }

  create(plan: Plan): Promise<Plan> {
    return this.plansRepository.save(plan);
  }

  async update(plan_id: string, updatedPlan: Partial<Plan>): Promise<Plan> {
    return this.plansRepository.update(plan_id, updatedPlan).then(() => {
      return this.plansRepository.findOneBy({ plan_id });
    });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.plansRepository.delete(id);
  }
}
