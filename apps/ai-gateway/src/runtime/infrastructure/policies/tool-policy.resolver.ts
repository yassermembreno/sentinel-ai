import { Injectable } from '@nestjs/common';

import { ToolSecurityPolicy } from '../../application/ports/tool-security-policy';
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
      ['close_ticket', operationalDenyPolicy],
      ['create_ticket', operationalDenyPolicy],
      ['change_billing_plan', operationalDenyPolicy],
    ]);
  }

  resolve(toolName: string): ToolSecurityPolicy | undefined {
    return this.byToolName.get(toolName);
  }
}
