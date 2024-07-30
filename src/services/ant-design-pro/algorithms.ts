/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-30 09:23:09
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 09:23:22
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/algorithms.ts
 */
import { request } from '@umijs/max';

export async function listAlgorithms() {
  return request('/api/algorithms/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
