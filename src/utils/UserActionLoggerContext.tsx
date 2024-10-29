/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-21 09:49:52
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-29 13:50:58
 * @FilePath: /PoseidonAI-Client/src/utils/UserActionLoggerContext.tsx
 */
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import logger, { LogEntry } from './Logger';

interface UserActionLoggerContextType {
  logAction: (
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
    action: string,
    details?: string | any,
  ) => void;
  sendLogs: () => void; // 暴露出手动发送日志的方法
}

const UserActionLoggerContext = createContext<UserActionLoggerContextType | undefined>(undefined);

interface UserActionLoggerProviderProps {
  children: ReactNode;
  interval?: number; // 发送日志的时间间隔，默认5分钟（300000毫秒）
}

export const UserActionLoggerProvider: React.FC<UserActionLoggerProviderProps> = ({
  children,
  interval = 300000,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 定义发送日志的函数（立即或定时发送）
  const sendLogs = () => {
    if (logs.length > 0) {
      logger.sendLogs(logs);
      setLogs([]);
    }
  };

  // 记录用户操作日志
  const logAction = (
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
    action: string,
    details?: string | any,
  ) => {
    const log = logger.createLog(level, action, details);
    setLogs((prevLogs) => [...prevLogs, log]);

    // 立即发送特定级别的日志
    if (level === 'ERROR' || level === 'FATAL') {
      sendLogs(); // 立即发送日志
    }
  };

  // 定时发送日志
  useEffect(() => {
    const timer = setInterval(() => {
      sendLogs(); // 定时批量发送日志
    }, interval);

    return () => clearInterval(timer);
  }, [logs, interval]);

  return (
    <UserActionLoggerContext.Provider value={{ logAction, sendLogs }}>
      {children}
    </UserActionLoggerContext.Provider>
  );
};

export const useUserActionLogger = (): UserActionLoggerContextType => {
  const context = useContext(UserActionLoggerContext);
  if (!context) {
    throw new Error('useUserActionLogger must be used within a UserActionLoggerProvider');
  }
  return context;
};
