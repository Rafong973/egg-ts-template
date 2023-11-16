interface ICustomError {
  type: string;
  data: {
    code: number,
    msg: any
  };
}

interface ISystemError extends ICustomError {
  statusCode: number;
}

function customError(errorBody: ICustomError) {
  return errorBody;
}

function systemError(errorBody: ISystemError) {
  return errorBody;
}

export default {
  GENERAL: {
    SERVER_ERROR: systemError({ type: 'system', statusCode: 500, data: { code: 500, msg: '服务器错误' } }),
    NOT_FOUND: (msg: string) => customError({ type: 'business', data: { code: 404, msg: msg || 'NOT_FOUND' } }),
    PARAM_ERROR: (msg: string) => customError({ type: 'business', data: { code: 400, msg: msg || '参数错误' } }),
    SIG_ERROR: customError({ type: 'business', data: { code: 400, msg: '签名错误' } }),
    TIMEOUT: customError({ type: 'business', data: { code: 400, msg: '请求时间过长' } })
  },
  USER: {
    UNAUTHORIZED: customError({ type: 'business', data: { code: 100001, msg: '未登录' } }),
    SEND_VERIFICATION_CODE_FAIL: customError({ type: 'business', data: { code: 100000, msg: '验证码发送失败，请稍等一会后重试' } }),
  },
  ADMIN: {
    NOT_PERMISSIONS: customError({ type: 'business', data: { code: 200001, msg: '该账号没有权限' } })
  }
};
