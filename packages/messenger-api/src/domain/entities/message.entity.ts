import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';
import { FileAttachment } from './file-attachment.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FileAttachment, (file) => file.message)
  files: FileAttachment[];
}
