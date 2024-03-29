import type { ITabProps } from '../../../../ui';
import type { NavigationElementType } from '../../../../../hooks';

export interface IIntegrationsProps {
  components: {
    [IntegrationsEnum.JIRA]: NavigationElementType;
    [IntegrationsEnum.Slack]: NavigationElementType;
    [IntegrationsEnum.Attachments]: NavigationElementType;
  };
  enabledIntegrationsCount: number;
}

export interface IIntegrationTab extends Partial<ITabProps> {
  name: IntegrationsEnum;
}

export enum IntegrationsEnum {
  JIRA = 'Jira',
  Slack = 'Slack',
  Attachments = 'Attachments',
}
