export interface SlackIntegrationProps {
  channel?: string;
  botToken: string;
}

export interface SlackIntegrationValues {
  slackSwitch?: boolean;
  slackChannel?: string;
}
