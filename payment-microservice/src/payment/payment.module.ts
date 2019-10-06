import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
