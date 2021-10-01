import { useState, useCallback } from 'react';

import type { ILogsProps, IAddLogProps, ILogs } from '../components';

export const useLogs = (): ILogsProps => {
  const [logs, setLogs] = useState<ILogs[]>([]);

  const addLog = useCallback((log: IAddLogProps) => {
    const timestamp = new Date().toLocaleTimeString('en-US');
    setLogs((prevLogs) => [...prevLogs, { ...log, timestamp }]);
  }, []);

  return {
    logs,
    addLog,
  };
};
