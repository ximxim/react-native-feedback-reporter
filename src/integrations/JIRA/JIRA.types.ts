interface IOptional {
  defaultValue?: string;
  isVisible?: boolean;
}

export interface JIRAIntegrationProps {
  token: string;
  domain: string;
  username: string;
  projectField?: IOptional;
  issueTypeField?: IOptional;
}

export interface JIRAIntegrationValues {
  JIRASwitch?: boolean;
  JIRAProject?: string;
  JIRAIssueType?: string;
}
