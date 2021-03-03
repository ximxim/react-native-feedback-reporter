export interface IReportFormProps {
  handleClose: () => void;
}

export interface IReportFormValues {
  uri: string;
  description: string;

  // JIRA CONTROLS
  project: string;
  issueType: string;
}
