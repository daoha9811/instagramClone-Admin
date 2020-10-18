import { requestData, methods } from '@/utils/axiosRequest';
export async function queryPost(params) {
  return requestData('/allposts');
}
export async function removePostService(id) {
  return requestData(`/posts/${id}`, {
    method: methods.delete,
  });
}
export async function updatePostService({ id, title }) {
  return requestData('/posts/update', {
    method: methods.post,
    data: {
      id,
      title,
    },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
