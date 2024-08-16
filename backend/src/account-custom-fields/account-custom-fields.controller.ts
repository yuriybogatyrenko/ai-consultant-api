import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccountCustomFieldsService } from './account-custom-fields.service';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { CreateAccountCustomFieldDto } from './dto/create-account-custom-field.dto';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller('account-custom-fields')
export class AccountCustomFieldsController {
  constructor(
    private readonly accountCustomFieldsService: AccountCustomFieldsService,
  ) {}

  @Get()
  getAccountCustomFields(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
  ) {
    return this.accountCustomFieldsService.getAccountCustomFields(
      userId,
      accountId,
    );
  }

  @Get(':id')
  getAccountCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
  ) {
    return this.accountCustomFieldsService.getAccountCustomField(
      userId,
      accountId,
      id,
    );
  }

  @Post()
  @UsePipes(new CustomValidationPipe())
  createAccountCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Body() body: CreateAccountCustomFieldDto,
  ) {
    return this.accountCustomFieldsService.createAccountCustomField(
      userId,
      accountId,
      body,
    );
  }

  @Put(':id')
  @UsePipes(new CustomValidationPipe())
  updateAccountCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
    @Body() body: Partial<CreateAccountCustomFieldDto>,
  ) {
    return this.accountCustomFieldsService.updateAccountCustomField(
      userId,
      accountId,
      id,
      body,
    );
  }

  @Delete(':id')
  deleteAccountCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
  ) {
    return this.accountCustomFieldsService.deleteAccountCustomField(
      userId,
      accountId,
      id,
    );
  }
}
