import install from '../hwRouter/install'
import { Context } from 'egg'

const auth = async (ctx: Context, permission: string) => {
  const {
    jwtInfo: { userInfo },
    service: { admin },
    customError
  } = ctx
  const realPermission = await admin.getPermission(userInfo.username)
  console.log(realPermission)
  if (realPermission === 'super' || (realPermission === 'normal' && permission !== 'super') || realPermission === permission) {
    return true
  }
  throw customError.USER.UNAUTHORIZED
}

export default function (permission: string = 'read_only') {
  return (target: any, value?: any, des?: (PropertyDescriptor & ThisType<any>) | undefined) => {
    return install(target, value, des, async (ctx: Context) => {
      try {
        await auth(ctx, permission)
      } catch (e) {
        throw e
      }
    })
  }
}
