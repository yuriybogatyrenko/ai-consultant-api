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
import { ContactCustomFieldsService } from './contact-custom-fields.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { CreateContactCustomFieldDto } from './dto/create-contact-custom-field-value.dto';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller('contact-custom-fields')
export class ContactCustomFieldsController {
  constructor(
    private readonly constactCustomFieldsService: ContactCustomFieldsService,
  ) {}

  @Get()
  getContactCustomFields(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
  ) {
    return this.constactCustomFieldsService.getContactCustomFields(
      userId,
      accountId,
    );
  }

  @Get(':id')
  getContactCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
  ) {
    return this.constactCustomFieldsService.getContactCustomField(
      userId,
      accountId,
      id,
    );
  }

  @Post()
  @UsePipes(new CustomValidationPipe())
  createContactCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Body() body: CreateContactCustomFieldDto,
  ) {
    return this.constactCustomFieldsService.createContactCustomField(
      userId,
      accountId,
      body,
    );
  }

  @Put(':id')
  @UsePipes(new CustomValidationPipe())
  updateContactCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
    @Body() body: Partial<CreateContactCustomFieldDto>,
  ) {
    return this.constactCustomFieldsService.updateContactCustomField(
      userId,
      accountId,
      id,
      body,
    );
  }

  @Delete(':id')
  deleteContactCustomField(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('id') id: number,
  ) {
    return this.constactCustomFieldsService.deleteContactCustomField(
      userId,
      accountId,
      id,
    );
  }
}
