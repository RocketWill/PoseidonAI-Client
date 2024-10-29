// src/utils/Logger.ts
import { submitUserLogs } from '@/services/ant-design-pro/userLogs';

export interface BrowserInfo {
  browser: string;
  browserVersion: string;
  os: string;
  screenResolution: string;
}

export interface LogEntry {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  action: string;
  details?: string;
  userId?: string;
  url: string;
  referrer?: string;
  browserInfo: BrowserInfo;
  deviceType: string;
  language: string;
  timezone: string;
  networkType?: string;
}

class Logger {
  private userId?: string;

  // 设置用户ID（在用户登录后调用）
  setUserId(userId: string) {
    this.userId = userId;
  }

  // 记录用户操作
  logAction(
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
    action: string,
    details?: string | any,
  ) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      action,
      details,
      userId: this.userId,
      url: window.location.href,
      referrer: document.referrer,
      browserInfo: this.getBrowserInfo(),
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      networkType: (navigator as any).connection?.effectiveType || 'Unknown',
    };
    this.sendLog(logEntry);
  }

  // 创建日志条目（不发送）
  createLog(
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
    action: string,
    details?: string | any,
  ): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      action,
      details,
      userId: this.userId,
      url: window.location.href,
      referrer: document.referrer,
      browserInfo: this.getBrowserInfo(),
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      networkType: (navigator as any).connection?.effectiveType || 'Unknown',
    };
    return logEntry;
  }

  // 获取浏览器信息
  private getBrowserInfo(): BrowserInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    let browser = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9]+)\./)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9]+)\./)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Safari') > -1) {
      browser = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9]+)\./)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
      browser = 'Internet Explorer';
      browserVersion = userAgent.match(/MSIE ([0-9]+)\./)?.[1] || 'Unknown';
    }

    return {
      browser,
      browserVersion,
      os: platform,
      screenResolution,
    };
  }

  // 发送日志到服务器
  private async sendLog(log: LogEntry) {
    try {
      const response = await submitUserLogs(JSON.stringify([log]));

      if (response.code === 200) {
        console.log('Log successfully sent to server');
      } else {
        console.error('Failed to send log to server');
      }
    } catch (error) {
      console.error('Error sending log to server:', error);
    }
  }

  async sendLogs(logs: LogEntry[]) {
    try {
      const response = await submitUserLogs(JSON.stringify(logs));

      if (response.code === 200) {
        console.log('Logs successfully sent to server');
      } else {
        console.error('Failed to send logs to server');
      }
    } catch (error) {
      console.error('Error sending logs to server:', error);
    }
  }
}

// 创建单例实例
const logger = new Logger();
export default logger;
