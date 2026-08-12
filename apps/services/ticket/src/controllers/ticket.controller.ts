import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { TicketService } from '@ticket/application/services/ticket.service';
import { TicketValidationService } from '@ticket/application/validation/ticket-validation.service';
import type { TicketResponseDto } from '@ticket/application/dto/ticket-response.dto';

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly validationService: TicketValidationService,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<TicketResponseDto> {
    const input = this.validationService.validateCreate(body);
    return this.ticketService.create(input);
  }

  @Get()
  async list(
    @Query('customerId') customerId: string,
  ): Promise<TicketResponseDto[]> {
    const id = this.validationService.validateUuid(customerId, 'customerId');
    return this.ticketService.listByCustomer(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TicketResponseDto> {
    const ticketId = this.validationService.validateUuid(id, 'ticketId');
    return this.ticketService.getById(ticketId);
  }

  @Post(':id/close')
  async close(@Param('id') id: string): Promise<TicketResponseDto> {
    const ticketId = this.validationService.validateUuid(id, 'ticketId');
    return this.ticketService.close(ticketId);
  }
}
