import type { IPostJiraMeta } from './mutations/postJIRAIssue';
interface IOptional {
  defaultValue?: string;
}

export interface JIRAIntegrationProps {
  token?: string;
  domain: string;
  username?: string;
  projectField?: IOptional;
  issueTypeField?: IOptional;
  order?: JIRAComponents[];
  meta?: IPostJiraMeta;
}

export interface JIRAIntegrationValues {
  JIRASwitch?: boolean;
  JIRAProject?: string;
  JIRAIssueType?: string;
}

export enum JIRAComponents {
  JIRASwitch = 'jira_switch',
  JIRAProjects = 'jira_projects',
  JIRAIssueTypes = 'jira_issue_types',
  JIRAAccountLinking = 'jira_account_linking',
}
