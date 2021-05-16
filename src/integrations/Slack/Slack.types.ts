export interface SlackIntegrationProps {
  channel?: string;
  botToken: string;
  order?: SlackComponents[];
}

export interface SlackIntegrationValues {
  slackSwitch?: boolean;
  slackChannel?: string;
}

export enum SlackComponents {
  SlackSwitch = 'slack_switch',
  SlackChannelsSelector = 'slack_channels_selector',
}
