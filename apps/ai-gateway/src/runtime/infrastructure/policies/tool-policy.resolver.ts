import { Injectable } from '@nestjs/common';

import { ToolSecurityPolicy } from '../../application/ports/tool-security-policy';
import { MutatingToolName } from '../../domain/enums/mutating-tool-name';
import { ApplyCreditPolicy } from './tools/apply-credit.policy';
import { IssueRefundPolicy } from './tools/issue-refund.policy';
import { OperationalDenyPolicy } from './tools/operational-deny.policy';

@Injectable()
export class ToolPolicyResolver {
  private readonly byToolName: Map<string, ToolSecurityPolicy>;

  constructor(
    applyCreditPolicy: ApplyCreditPolicy,
    issueRefundPolicy: IssueRefundPolicy,
    operationalDenyPolicy: OperationalDenyPolicy,
  ) {
    this.byToolName = new Map<string, ToolSecurityPolicy>([
      [applyCreditPolicy.tool, applyCreditPolicy],
      [issueRefundPolicy.tool, issueRefundPolicy],
      [MutatingToolName.CLOSE_TICKET, operationalDenyPolicy],
      [MutatingToolName.CREATE_TICKET, operationalDenyPolicy],
      [MutatingToolName.CHANGE_BILLING_PLAN, operationalDenyPolicy],
    ]);
  }

  resolve(toolName: string): ToolSecurityPolicy | undefined {
    return this.byToolName.get(toolName);
  }
}
