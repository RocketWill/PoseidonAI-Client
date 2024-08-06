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
