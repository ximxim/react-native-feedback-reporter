import { createContext } from 'react';

import type { ILogsProps } from './Logs.types';

export const Logs = createContext<ILogsProps>({
  logs: [],
  addLog: () => {},
});
