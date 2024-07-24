import { request } from '@umijs/max';

export async function listDetectTypes() {
    return request('/api/detect-types/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
}