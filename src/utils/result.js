export default class Result {
  static success(data) {
    return { code: 0, msg: '请求成功', data }
  }

  static error(code, msg) {
    return { code, msg, data: null }
  }
}

export const ERROR_INFO = {
  NoToken: { code: 11, msg: 'token 不存在，请登录后再试' },

  InvalidToken: { code: 12, msg: 'token 无效， 请登录后再试' },

  ExistAccount: { code: 13, msg: '账号已存在，请换个账号注册' },

  BeyondLength: { code: 14, msg: '用户名长度过长，请换个账号注册' },

  BadAccount: { code: 15, msg: '账号名或者密码错误，请重新尝试' },

  DatabaseError: { code: 16, msg: '数据操作错误，请重新尝试' },

  ExistCategory: { code: 17, msg: '新增分类无效，该分类已存在' },

  InvalidFile: { code: 18, msg: '文件格式错误，请重新上传' }
}
