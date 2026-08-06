import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ValidationStrategy, SafeValidationStrategy } from '@sentinel/validation';

import { TicketEntity } from '@ticket/infrastructure/persistence/entities/ticket.entity';
import { TicketTypeOrmRepository } from '@ticket/infrastructure/persistence/repositories/ticket.typeorm.repository';
import { TicketService } from '@ticket/application/services/ticket.service';
import { TicketValidationService } from '@ticket/application/validation/ticket-validation.service';
import { TicketController } from '@ticket/controllers/ticket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  controllers: [TicketController],
  providers: [
    { provide: 'TicketRepository', useClass: TicketTypeOrmRepository },
    { provide: ValidationStrategy, useClass: SafeValidationStrategy },
    TicketService,
    TicketValidationService,
  ],
  exports: [TicketService],
})
export class TicketModule {}
