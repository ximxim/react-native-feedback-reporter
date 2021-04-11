import { slackApi } from '../slackApi.service';

interface ISlackValue {
  value: string;
  creator: string;
  last_set: number;
}
interface ISlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  name_normalized: string;
  is_shared: boolean;
  parent_conversation: unknown;
  creator: string;
  is_ext_shared: boolean;
  is_org_shared: boolean;
  shared_team_ids: string[];
  pending_shared: unknown[];
  pending_connected_team_ids: unknown[];
  is_pending_ext_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  topic: ISlackValue;
  purpose: ISlackValue;
  previous_names: unknown[];
}

interface IPostSlackConversationJoinResponse {
  ok: boolean;
  channel: ISlackChannel;
  warning: string;
  response_metadata: {
    warnings: string[];
  };
}

interface IPostSlackConversationsJoinProps {
  channelId?: string;
}

export const postSlackConversationJoin = ({
  channelId,
}: IPostSlackConversationsJoinProps) =>
  slackApi.post<IPostSlackConversationJoinResponse>(
    'conversations.join',
    null,
    { params: { channel: channelId } }
  );
