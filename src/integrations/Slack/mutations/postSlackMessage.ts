import { slackApi } from '../slackApi.service';

interface IAttachment {
  text: string;
  pretext: string;
  id: number;
  fallback: string;
}

interface IMessage {
  type: string;
  subtype: string;
  text: string;
  ts: string;
  username: string;
  bot_id: string;
  thread_ts: string;
  attachments: IAttachment[];
}

interface IPostSlackMessageResponse {
  ok: boolean;
  channel: string;
  ts: string;
  message: IMessage;
}

interface IPostSlackMessageProps {
  title: string;
  channel?: string;
  description: string;
}

export const postSlackMessage = ({
  description,
  title,
  channel,
}: IPostSlackMessageProps) =>
  slackApi.post<IPostSlackMessageResponse>('chat.postMessage', null, {
    params: {
      text: title,
      channel: channel || 'general',
      attachments: JSON.stringify([{ pretext: description }]),
    },
  });
