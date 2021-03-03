interface IOptional {
  defaultValue?: string;
  isVisible?: boolean;
}
export interface IFeedbackReporterProps {
  mode?: 'onScreenShot';
  /**
   * Project field props
   */
  projectField?: IOptional;

  /**
   * Issue type field props
   */
  issueTypeField?: IOptional;

  /**
   * Steps to create field props
   */
  stepsToCreateField?: IOptional;

  /**
   * Intended outcomefield props
   */
  intendedOutcomeField?: IOptional;

  /**
   * Actual outcomefield props
   */
  actualOutcomeField?: IOptional;

  /**
   * Version field props
   */
  versionField?: IOptional;
}
