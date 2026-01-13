import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AddEmailQueueDto } from './dto/add-email-queue.dto';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async addEmailJob(emailData: AddEmailQueueDto): Promise<void> {
    await this.mailQueue.add('send-email', emailData);
  }
}
