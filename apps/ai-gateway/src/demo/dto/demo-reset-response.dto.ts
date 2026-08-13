export interface DemoResetTicketDto {
  id: string;
  status: string;
}

export interface DemoResetResponseDto {
  tickets: DemoResetTicketDto[];
  creditsDeleted: number;
}
