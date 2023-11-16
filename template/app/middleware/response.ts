import { Context, ClientErrorResponse } from 'egg'
import { returnBody } from '../../typings/index'

export default function errorMiddle() {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      ctx.custom = {}
      await next()
      if (ctx.state.isDownloadCsv) {
        return
      }
      if (ctx.customBody) {
        return
      }
      if (ctx.status === 404) {
        throw ctx.customError.GENERAL.NOT_FOUND('接口不存在或methods错误')
      }
      if (ctx.state.html) {
        ctx.set('Content-Type', 'text/html; charset=utf8')
        ctx.status = ctx.status || 200
        return
      }
      ctx.status = ctx.status || 200
      ctx.body = Object.assign(
        {
          payload: ctx.body || {}
        },
        {
          code: 0
        }
      )
    } catch (err) {
      let error = err
      console.log(err)
      if (typeof err === 'function') {
        const obj = err()
        // 是自定义错误，自定义错误可能是函数
        if (obj.statusCode && obj.data) {
          error = obj
        }
      }

      if ((error as returnBody).type === 'business') {
        // 自定义的业务错误
        ctx.logger.error(error)
        ctx.body = Object.assign(
          {
            payload: ctx.body || {}
          },
          (error as returnBody).data
        )
      } else if ((error as returnBody).type === 'system') {
        // 自定义的系统错误
        ctx.logger.error(error)
        ctx.status = (error as returnBody).statusCode
        ctx.body = Object.assign(
          {
            payload: ctx.body || {}
          },
          (error as returnBody).data
        )
      } else {
        // 非自定义错误
        // 在 app 上触发一个 error 事件，框架会记录一条错误日志
        ctx.app.emit('error', error, ctx)
        const SERVER_ERROR = ctx.customError.GENERAL.SERVER_ERROR
        ctx.status = SERVER_ERROR.statusCode
        ctx.body = Object.assign(
          {
            payload: ctx.body || {}
          },
          { code: 500, msg: (error as returnBody).message }
        )
      }
    }
  }
}
