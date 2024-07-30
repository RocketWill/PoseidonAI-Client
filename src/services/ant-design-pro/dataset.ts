/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-07-30 16:02:31
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/dataset.ts
 */

import token from '@/utils/token';
import { request } from '@umijs/max';

export async function createDataset(body: any) {
  return request('/api/datasets/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body,
  });
}

export async function listDataset() {
  return request('/api/datasets/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function deleteDataset(datasetId: string) {
  return request(`/api/datasets/${datasetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function visDataset(datasetId: string) {
  return request(`/api/datasets/vis/${datasetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function getVisDatasetStatus(taskId: string) {
  return request(`/api/datasets/vis/${taskId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function checkVisDatasetDirExist(datasetId: string) {
  return request(`/api/datasets/checkVis/${datasetId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function findByFormatAndDetectType(datasetFormatId: string, detectTypeId: string) {
  return request(`/api/datasets/findby/${datasetFormatId}/${detectTypeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}
