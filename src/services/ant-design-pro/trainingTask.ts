/*
 * @Author: Will Cheng (will.cheng@efctw.com)
 * @Date: 2024-08-05 11:28:13
 * @LastEditors: Will Cheng (will.cheng@efctw.com)
 * @LastEditTime: 2024-08-08 16:38:02
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/trainingTask.ts
 */
import token from '@/utils/token';
import { request } from '@umijs/max';

export async function createTask(body: any) {
  return request('/api/training-tasks/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body,
  });
}

export async function getCreateTaskStatus(taskId: string) {
  return request(`/api/training-tasks/task-create-status/${taskId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function listUserTasks() {
  return request('/api/training-tasks/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function getUserTask(taskId: string) {
  return request(`/api/training-tasks/list/${taskId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function startTraining(taskId: string) {
  return request(`/api/training-tasks/train/${taskId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function getTrainingStatus(
  trainingTaskId: string,
  algoName: string,
  frameworkName: string,
  saveKey: string,
) {
  return request(
    `/api/training-tasks/train-status/${trainingTaskId}/${algoName}/${frameworkName}/${saveKey}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.get()}`,
      },
    },
  );
}

export async function stopTraining(
  trainingTaskId: string,
  algoName: string,
  frameworkName: string,
) {
  return request(`/api/training-tasks/train/${trainingTaskId}/${algoName}/${frameworkName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function evaluationTask(taskId: string, body: any) {
  return request(`/api/training-tasks/evaluation/${taskId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body, // 确保将 body 序列化为 JSON 字符串
  });
}

export async function getEvaluationStatus(evalId: string, algoName: string, frameworkName: string) {
  return request(`/api/training-tasks/eval-task-status/${evalId}/${algoName}/${frameworkName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}
