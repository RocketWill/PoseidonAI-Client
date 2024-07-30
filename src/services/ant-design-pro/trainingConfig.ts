/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 21:42:04
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-30 20:38:29
 * @FilePath: /PoseidonAI-Client/src/services/ant-design-pro/trainingConfig.ts
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
import token from '@/utils/token';
import { request } from '@umijs/max';

export async function listTrainingFrameworks() {
  return request('/api/training-frameworks/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function createConfigs(body: any) {
  return request('/api/training-configurations/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.get()}`,
    },
    data: body,
  });
}

export async function listUserTrainingConfigs() {
  return request('/api/training-configurations/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function findByUserAndFramework(training_framework_id: string) {
  return request(`/api/training-configurations/findby/${training_framework_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}

export async function deleteTrainingConfig(configId: string) {
  return request(`/api/training-configurations/delete/${configId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.get()}`,
    },
  });
}
