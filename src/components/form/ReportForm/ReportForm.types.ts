export interface IReportFormProps {
  handleClose: () => void;
}

export interface IReportFormValues {
  uri: string;
  version: string;
  stepsToRecreate: string;
  intendedOutcome: string;
  actualOutcome: string;
}
