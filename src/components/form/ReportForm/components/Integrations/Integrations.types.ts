import type { NavigationElementType } from '../../../../../hooks';

export interface IIntegrationsProps {
  components: {
    [IntegrationsEnum.JIRA]: NavigationElementType;
    [IntegrationsEnum.Slack]: NavigationElementType;
  };
  enabledIntegrationsCount: number;
}

export enum IntegrationsEnum {
  JIRA = 'Jira',
  Slack = 'Slack',
}
