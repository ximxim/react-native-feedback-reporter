interface IOptional {
  defaultValue?: string;
  isVisible?: boolean;
}

export interface JIRAIntegrationProps {
  token: string;
  username: string;
  projectField?: IOptional;
  issueTypeField?: IOptional;
}
