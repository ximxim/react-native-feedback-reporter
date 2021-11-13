import { JIRAApi } from '../JIRAApi.service';

export interface IPostJIRAIssueResponse {
  id: string;
  key: string;
  self: string;
}

export interface IPostJiraMeta {
  labels?: string[];
}

interface IPostJIRAIssueProps {
  title: string;
  projectId: string;
  issueTypeId: string;
  description: string;
  meta?: IPostJiraMeta;
}

export const postJIRAIssue = ({
  projectId,
  issueTypeId,
  description,
  title,
  meta,
}: IPostJIRAIssueProps) => {
  const content = [];
  content.push({
    type: 'paragraph',
    content: [
      {
        text: description,
        type: 'text',
      },
    ],
  });

  return JIRAApi.post<IPostJIRAIssueResponse>('issue', {
    update: {},
    fields: {
      summary: title,
      issuetype: { id: issueTypeId },
      project: { id: projectId },
      description: {
        type: 'doc',
        version: 1,
        content,
      },
      ...meta,
      labels: ['rnfr', ...(meta?.labels || [])],
    },
  });
};
