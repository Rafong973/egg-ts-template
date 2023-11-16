import install from '../hwRouter/install'
import { Context } from 'egg'

import dayjs = require('dayjs')

const auth = async (ctx: Context) => {
  // 密钥是项目名称
  const secret = ctx.app.config.project

  const { helper, customError } = ctx
  let paramStr: string = ''
  if (ctx.method === 'GET') {
    paramStr = helper.qs(ctx.query)
  } else if (['POST', 'DELETE', 'PUT', 'PATCH'].indexOf(ctx.method) > -1) {
    paramStr = helper.qs(ctx.request.body)
  }
  const reqTime = ctx.get('X-TIME')
  const reqSig = ctx.get('X-SIG')
  if (!reqTime || !reqSig) {
    throw customError.GENERAL.PARAM_ERROR
  }
  const sortedParamStr = helper.sortParamStr(paramStr)
  const calSig = helper.sha1(sortedParamStr + reqTime + secret)
  if (reqSig !== calSig) {
    throw customError.GENERAL.SIG_ERROR
  }
  // 请求时间超过10s，禁止请求
  if (dayjs().diff(dayjs.unix(Number(reqTime)), 'seconds') > 10) {
    throw customError.GENERAL.TIMEOUT
  }
}

export default function () {
  return (target: any, value?: any, des?: (PropertyDescriptor & ThisType<any>) | undefined) => {
    return install(target, value, des, async (ctx: Context) => {
      try {
        await auth(ctx)
      } catch (e) {
        throw e
      }
    })
  }
}
