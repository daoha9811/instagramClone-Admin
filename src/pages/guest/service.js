import { requestData, methods } from '@/utils/axiosRequest';
export async function queryUsers(params) {
  return requestData('/allusers');
}

export async function removeUserService(id) {
  return requestData(`/user/${id}`, {
    method: methods.delete,
  });
}
export async function updateUserService({ id, name, password }) {
  return requestData('/user/update', {
    method: methods.post,
    data: {
      id,
      name,
      password,
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
