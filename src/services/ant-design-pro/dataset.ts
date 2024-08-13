/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-07-29 08:28:24
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-13 15:42:37
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/dataset.ts
 */

// 引入token工具函數和request模塊
import token from '@/utils/token';
import { request } from '@umijs/max';

// 創建數據集
export async function createDataset(body: FormData): Promise<any> {
  return request('/api/datasets/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body,
  });
}

// 獲取用戶數據集列表
export async function listDataset(): Promise<any> {
  return request('/api/datasets/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 刪除指定數據集
export async function deleteDataset(datasetId: string): Promise<any> {
  return request(`/api/datasets/${datasetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 可視化指定數據集
export async function visDataset(datasetId: string): Promise<any> {
  return request(`/api/datasets/vis/${datasetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 獲取數據集可視化狀態
export async function getVisDatasetStatus(taskId: string): Promise<any> {
  return request(`/api/datasets/vis/${taskId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 檢查可視化數據集目錄是否存在
export async function checkVisDatasetDirExist(datasetId: string): Promise<any> {
  return request(`/api/datasets/checkVis/${datasetId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 根據格式和檢測類型查找數據集
export async function findByFormatAndDetectType(
  datasetFormatId: string,
  detectTypeId: string,
): Promise<any> {
  return request(`/api/datasets/findby/${datasetFormatId}/${detectTypeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

// 獲取數據集統計信息
export async function getDatasetStatistics(datasetId: string): Promise<any> {
  return request(`/api/datasets/statistics/${datasetId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}
