
import { request } from '@umijs/max';
import token from '@/utils/token';

export async function createDataset(body: any) {
    return request('/api/datasets/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token.get()}`
      },
      data: body
    });
}

export async function listDataset() {
    return request('/api/datasets/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.get()}`
      }
    });
}

export async function deleteDataset(datasetId: string) {
    return request(`/api/datasets/${datasetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.get()}`
      }
    });
}

export async function visDataset(datasetId: string) {
  return request(`/api/datasets/vis/${datasetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`
    }
  });
}

export async function getVisDatasetStatus(taskId: string) {
  return request(`/api/datasets/vis/${taskId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.get()}`
    }
  });
}

export async function checkVisDatasetDirExist(datasetId: string) {
  return request(`/api/datasets/checkVis/${datasetId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`
    }
  });
}