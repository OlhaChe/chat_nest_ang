import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from './conversations.service';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { MessagesService } from './messages.service';
import { MessageModel } from './model/message.model';
import { EditMessageModel } from './model/edit-message.model';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ cors: true })
export class ConvesationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    payload: MessageModel,
  ): Promise<void> {
    const message = await this.messagesService.saveMessage(
      (client?.handshake as any)?.user.id,
      payload,
    );
    this.server.emit(`conversation_${payload.conversationId}`, {
      type: 'single',
      data: message,
    });
  }

  @SubscribeMessage('fetch_messages')
  async handleFetchMessages(
    client: Socket,
    payload: { conversationId: number },
  ): Promise<void> {
    const messages = await this.messagesService.getMessagesByConversation(
      payload.conversationId,
    );
    client.emit(`conversation_${payload.conversationId}`, {
      type: 'bulk',
      data: messages,
    });
  }

  @SubscribeMessage('edit_message')
  async handleEditMessage(
    client: Socket,
    payload: EditMessageModel,
  ): Promise<void> {
    const message = await this.messagesService.editMessage(
      (client?.handshake as any)?.user.id,
      payload,
    );
    this.server.emit(`message_edited_in_${payload.conversationId}`, {
      type: 'update',
      data: message,
    });
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    client: Socket,
    payload: EditMessageModel,
  ): Promise<void> {
    await this.messagesService.deleteMessage(
      payload.messageId,
      (client?.handshake as any)?.user.id,
    );
    this.server.emit(`message_edited_in_${payload.conversationId}`, {
      type: 'delete',
      data: payload.messageId,
    });
  }
}
