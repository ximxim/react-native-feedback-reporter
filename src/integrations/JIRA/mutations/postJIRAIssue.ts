import { JIRAApi } from '../JIRAApi.service';

export interface IPostJIRAIssueResponse {
  id: string;
  key: string;
  self: string;
}

interface IPostJIRAIssueProps {
  title: string;
  devNotes?: string;
  projectId: string;
  issueTypeId: string;
  description: string;
}

export const postJIRAIssue = ({
  projectId,
  issueTypeId,
  description,
  title,
  devNotes,
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

  if (devNotes) {
    content.push({
      type: 'paragraph',
      content: [
        {
          text: devNotes,
          type: 'text',
        },
      ],
    });
  }

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
      labels: ['feedback-reporter'],
    },
  });
};
