/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-10-21 13:44:58
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-10-29 11:24:32
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/userLogs.ts
 */
import token from '@/utils/token';
import { request } from '@umijs/max';

export async function submitUserLogs(body: any) {
  return request('/api/user-logs/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body,
  });
}

export async function getUserLogs() {
  return request('/api/user-logs/logs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}
