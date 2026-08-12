import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TOOLS_REGISTRY } from './application/ports/tool-registry.token';
import { TOOL_EXECUTOR } from './application/ports/tool-executor.token';
import { DefaultToolRegistry } from './infrastructure/default-tool-registry';
import { DefaultToolExecutor } from './infrastructure/default-tool-executor';
import { EchoTool } from './infrastructure/echo/echo-tool';
import { CustomerSearchTool } from './infrastructure/customer-search/customer-search.tool';
import { GetCustomerProfileTool } from './infrastructure/customer-search/get-customer-profile.tool';
import { CUSTOMER_SERVICE_OPTIONS } from './infrastructure/customer-search/customer-service.options.token';
import { CustomerServiceOptions } from './infrastructure/customer-search/customer-service.options';
import { GetInvoiceStatusTool } from './infrastructure/billing/get-invoice-status.tool';
import { ApplyCreditTool } from './infrastructure/billing/apply-credit.tool';
import { IssueRefundTool } from './infrastructure/billing/issue-refund.tool';
import { ChangeBillingPlanTool } from './infrastructure/billing/change-billing-plan.tool';
import { BILLING_SERVICE_OPTIONS } from './infrastructure/billing/billing-service.options.token';
import { GetTicketTool } from './infrastructure/ticket/get-ticket.tool';
import { ListCustomerTicketsTool } from './infrastructure/ticket/list-customer-tickets.tool';
import { CreateTicketTool } from './infrastructure/ticket/create-ticket.tool';
import { CloseTicketTool } from './infrastructure/ticket/close-ticket.tool';
import { TICKET_SERVICE_OPTIONS } from './infrastructure/ticket/ticket-service.options.token';
import { ServiceBaseUrlOptions } from './infrastructure/shared/service-base-url.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    EchoTool,
    CustomerSearchTool,
    GetCustomerProfileTool,
    GetInvoiceStatusTool,
    ApplyCreditTool,
    IssueRefundTool,
    ChangeBillingPlanTool,
    ListCustomerTicketsTool,
    GetTicketTool,
    CreateTicketTool,
    CloseTicketTool,
    {
      provide: CUSTOMER_SERVICE_OPTIONS,
      useFactory: (config: ConfigService): CustomerServiceOptions => ({
        baseUrl:
          config.get<string>('CUSTOMER_SERVICE_BASE_URL') ??
          'http://localhost:3002',
      }),
      inject: [ConfigService],
    },
    {
      provide: BILLING_SERVICE_OPTIONS,
      useFactory: (config: ConfigService): ServiceBaseUrlOptions => ({
        baseUrl:
          config.get<string>('BILLING_SERVICE_BASE_URL') ??
          'http://localhost:3003',
      }),
      inject: [ConfigService],
    },
    {
      provide: TICKET_SERVICE_OPTIONS,
      useFactory: (config: ConfigService): ServiceBaseUrlOptions => ({
        baseUrl:
          config.get<string>('TICKET_SERVICE_BASE_URL') ??
          'http://localhost:3004',
      }),
      inject: [ConfigService],
    },
    {
      provide: TOOLS_REGISTRY,
      useFactory: (
        echo: EchoTool,
        customerSearch: CustomerSearchTool,
        getCustomerProfile: GetCustomerProfileTool,
        getInvoiceStatus: GetInvoiceStatusTool,
        applyCredit: ApplyCreditTool,
        issueRefund: IssueRefundTool,
        changeBillingPlan: ChangeBillingPlanTool,
        listCustomerTickets: ListCustomerTicketsTool,
        getTicket: GetTicketTool,
        createTicket: CreateTicketTool,
        closeTicket: CloseTicketTool,
      ) =>
        new DefaultToolRegistry([
            //echo,
            customerSearch,
            getCustomerProfile,
            getInvoiceStatus,
            applyCredit,
            issueRefund,
            changeBillingPlan,
            listCustomerTickets,
            getTicket,
            createTicket,
            closeTicket,
          ]),
      inject: [
        EchoTool,
        CustomerSearchTool,
        GetCustomerProfileTool,
        GetInvoiceStatusTool,
        ApplyCreditTool,
        IssueRefundTool,
        ChangeBillingPlanTool,
        ListCustomerTicketsTool,
        GetTicketTool,
        CreateTicketTool,
        CloseTicketTool,
      ],
    },
    {
      provide: TOOL_EXECUTOR,
      useClass: DefaultToolExecutor,
    },
  ],
  exports: [TOOLS_REGISTRY, TOOL_EXECUTOR],
})
export class ToolsModule {}
