import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, IsNull, LessThan } from 'typeorm';
import * as fs from 'fs/promises';
import { FileAttachment } from 'src/domain/entities/file-attachment.entity';

@Injectable()
export class FileDeleteTask {
  private readonly logger = new Logger(FileDeleteTask.name);

  constructor(private dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyCleanup(): Promise<void> {
    this.logger.log('Starting daily cleanup task.');

    const oneHourAgo = new Date();
    oneHourAgo.setHours(new Date().getHours() - 1);

    try {
      const attachments = await this.dataSource
        .getRepository(FileAttachment)
        .find({
          where: {
            message: IsNull(),
            createdAt: LessThan(oneHourAgo),
          },
        });
      for (const attachment of attachments) {
        try {
          await fs.unlink(attachment.path);
          await this.dataSource
            .getRepository(FileAttachment)
            .delete(attachment.id); // Delete DB record
          this.logger.log(`Deleted file and record for ID: ${attachment.id}`);
        } catch (error) {
          this.logger.error(
            `Error deleting file for ID: ${attachment.id}`,
            error.stack,
          );
        }
      }
      this.logger.log('Daily cleanup task completed.');
    } catch (error) {
      this.logger.error('Error during daily cleanup task', error.stack);
    }
  }
}
