import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { db_host, db_name } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${db_host}/${db_name}`),
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
