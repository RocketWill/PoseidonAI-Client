import { request } from '@umijs/max';

export async function listDatasetFormats() {
    return request('/api/dataset-formats/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
}