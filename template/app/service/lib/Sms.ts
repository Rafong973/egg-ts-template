require('module-alias/register')
import BaseService from '@base/baseService'
import { Context } from 'egg'
import Core = require('@alicloud/pop-core')

const requestOption = {
  method: 'POST'
}

export default class SmsService extends BaseService {
  private smsConfig = this.app.config.aliyun.sms

  private smsClient = new Core({
    accessKeyId: this.smsConfig.accessKeyId,
    accessKeySecret: this.smsConfig.accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  })

  constructor(ctx: Context) {
    super(ctx)
  }
  // 发送验证码
  public async sendCode(phone: string, type: string) {
    const params = {
      SignName: this.smsConfig.signName,
      templateCode: this.smsConfig.code[type]
    }
    try {
      const code = (Math.floor(Math.random() * 1000000) + '').padStart(6, '100000')
      const data = Object.assign(params, {
        PhoneNumbers: phone,
        TemplateParam: `{"code":"${code}"}`
      })
      const rKey = this.ctx.redisKey.verificationLoginCode(phone, type)
      const result: any = await this.smsClient.request('SendSms', data, requestOption)
      if (result.Code === 'OK') await this.ctx.app.commonRedis.setex(rKey, 3000, code)
      JSON.stringify(result)
      return true
    } catch (error) {
      console.log(error)
      throw this.ctx.customError.USER.SEND_VERIFICATION_CODE_FAIL
    }
  }
  // 验证验证码
  public async verifyCode(phone: string, code: string, type: string) {
    const rKey = this.ctx.redisKey.verificationLoginCode(phone, type)
    const redisCode = await this.ctx.app.commonRedis.get(rKey)
    if (redisCode === null) {
      throw new Error('验证码已失效，请重新获取')
    }
    if (code === redisCode) {
      await this.ctx.app.commonRedis.del(rKey)
      return true
    } else {
      throw new Error('验证码错误，请重新获取')
    }
  }
}
