import install from '../hwRouter/install'
import { Context } from 'egg'

const auth = async (ctx: Context, permissions: string[] = []) => {
  const authorizeHeader = ctx.get('Authorization')
  if (!authorizeHeader) {
    throw ctx.customError.USER.UNAUTHORIZED
  }
  const token = authorizeHeader.split(' ').pop()
  if (!token) {
    throw ctx.customError.USER.UNAUTHORIZED
  }
  const decoded: any = ctx.helper.jwtVerify(token, ctx.app.config.jwtAdminSecret, ctx.customError.USER.UNAUTHORIZED)
  if (!decoded.userInfo) {
    throw ctx.customError.USER.UNAUTHORIZED
  }
  // 如果长度为0，那么所有账号只验证账号密码就行
  // 如果长度不为0，那么需要加入super，因为super是所有接口都可用
  if (permissions.length > 0 && !['super', ...permissions].includes(decoded.userInfo.permissions)) {
    throw ctx.customError.ADMIN.NOT_PERMISSIONS
  }
  ctx.jwtInfo = { userInfo: decoded.userInfo }
}

export default function (permissions: string[] = [], allowNull: boolean = false) {
  return (target: any, value?: any, des?: (PropertyDescriptor & ThisType<any>) | undefined) => {
    return install(target, value, des, async (ctx: Context) => {
      try {
        await auth(ctx, permissions)
      } catch (e) {
        if (allowNull) {
          ctx.jwtInfo = {
            userInfo: null
          }
        } else {
          throw e
        }
      }
    })
  }
}
