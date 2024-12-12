import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '../auth/auth.guard';
import { ConversationModel } from './model/conversation.model';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ConversationDto,
  ConversationDtoWithMessage,
} from 'src/common/dto/conversation.dto';

@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create or get exist conversation',
    type: ConversationDto,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createConversation(
    @Req() req,
    @Body() conversationModel: ConversationModel,
  ) {
    return this.conversationsService.createOrGetConversation(
      req.user.id,
      conversationModel.otherUserId,
    );
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'NotFound.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: 'The conversation model',
    type: ConversationDto,
  })
  async getConversation(@Param('id') id: number) {
    return this.conversationsService.getConversation(id);
  }
}
