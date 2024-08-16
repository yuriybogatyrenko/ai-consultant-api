import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { Plan } from './entity/billing-plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/users/decoratorts/permissions.decorator';

@UseGuards(JwtAuthGuard)
@Permissions('admin')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Plan> {
    return this.plansService.findOne(id);
  }

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = new Plan();
    plan.name = createPlanDto.name;
    plan.price = createPlanDto.price;
    plan.description = createPlanDto.description;
    return this.plansService.create(plan);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.plansService.delete(id);
  }
}
