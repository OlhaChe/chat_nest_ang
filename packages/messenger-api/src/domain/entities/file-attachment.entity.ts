import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class FileAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalFilename: string;

  @Column()
  path: string;

  @ManyToOne(() => Message, (message) => message.files, {
    onDelete: 'SET NULL',
  })
  message: Message;

  @CreateDateColumn()
  createdAt: Date;
}
