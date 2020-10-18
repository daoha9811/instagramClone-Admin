/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import axios from 'axios';
import { notification } from 'antd';

const codeMessage = {
  200: 'Máy chủ đã trả về thành công dữ liệu được yêu cầu. ',
  201: 'Tạo hoặc sửa đổi dữ liệu thành công. ',
  202: 'Một yêu cầu đã vào hàng đợi nền (tác vụ không đồng bộ). ',
  204: 'Xóa dữ liệu thành công. ',
  400: 'Có lỗi trong yêu cầu được gửi và máy chủ không tạo hoặc sửa đổi dữ liệu. ',
  401: 'Người dùng không có quyền (mã thông báo, tên người dùng, mật khẩu sai). ',
  403: 'Người dùng được ủy quyền, nhưng truy cập bị cấm. ',
  404: 'Yêu cầu được gửi là một bản ghi không tồn tại và máy chủ không hoạt động. ',
  406: 'Định dạng được yêu cầu không có sẵn. ',
  410: 'Tài nguyên được yêu cầu đã bị xóa vĩnh viễn và sẽ không còn nữa. ',
  422: 'Khi tạo một đối tượng, một lỗi xác thực đã xảy ra. ',
  500: 'Đã xảy ra lỗi trong máy chủ, vui lòng kiểm tra máy chủ. ',
  502: 'Lỗi cổng. ',
  503: 'Dịch vụ không khả dụng, máy chủ tạm thời quá tải hoặc được bảo trì. ',
  504: 'Cổng vào đã hết thời gian chờ. ',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    if (response.status === 400) {
      const { data } = response;
      console.log('400 request ', data);
      // message: [{ constrains: {msg: ''} }]
      const allValidateError = data?.message || [];
      if (Array.isArray(allValidateError)) {
        return {
          validations: allValidateError.reduce(
            (acc, e) => ({ ...acc, [e.property]: e.constraints }),
            {},
          ),
        };
      }
      return data;
    }
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url, data } = response;
    notification.error({
      message: `Yêu cầu lỗi ${status}: ${url}`,
      description: errorText,
    });
    return data;
  }
  if (!response) {
    notification.error({
      description: 'Mạng của bạn không bình thường và bạn không thể kết nối với máy chủ',
      message: 'Mạng bất thường',
    });
    return 'corrupted network';
  }
  return '';
};

const axiosRequest = axios.create({
  baseURL: 'https://snowy-cuboid-vulcanodon.glitch.me/api',
  headers: {
    // "Accept": 'application/json',

    'x-language': 'vi',
  },
});
const axiosAuthRequest = axios.create({
  baseURL: 'https://snowy-cuboid-vulcanodon.glitch.me/api',
});

export const request = (axiosIns) => async (url, opts = {}) => {
  try {
    const options = {
      method: opts.method,
      transformResponse: [
        (data) => {
          try {
            const parsedData = JSON.parse(data);
            return parsedData;
          } catch (error) {
            return data;
          }
        },
      ],
      data: opts.data,
      params: opts.params,
      headers: opts.headers,
    };

    const result = await axiosIns({
      url,
      ...options,
    });
    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    const transformedError = errorHandler(error);
    return {
      success: false,
      message: transformedError,
    };
  }
};

export const requestData = async (url, options) => {
  return request(axiosRequest)(url, options);
};

export const requestAuth = async (url, options) => {
  return request(axiosAuthRequest)(url, options);
};

export const privateRequest = async (url, options) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    console.log(options, 'heresss');
    return request(axiosAuthRequest)(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return request(axiosAuthRequest)(url, options);
};

export const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete',
};

export default request;