export interface IAddLogProps {
  level: 'info' | 'debug' | 'error';
  message: string;
}

export interface ILogs extends IAddLogProps {
  timestamp: string;
}

export interface ILogsProps {
  logs: IAddLogProps[];
  addLog: (props: IAddLogProps) => void;
}
