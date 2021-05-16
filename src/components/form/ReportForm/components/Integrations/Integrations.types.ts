type ElementType = (ref: any) => JSX.Element;

export interface IIntegrationsProps {
  components: {
    [IntegrationsEnum.JIRA]: ElementType;
    [IntegrationsEnum.Slack]: ElementType;
  };
  enabledIntegrationsCount: number;
}

export enum IntegrationsEnum {
  JIRA = 'Jira',
  Slack = 'Slack',
}
