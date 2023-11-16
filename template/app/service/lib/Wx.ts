require('module-alias/register')
import BaseService from '@base/baseService'
import axios from 'axios'
import * as crypto from 'crypto'
const dayjs = require('dayjs')

export default class wxService extends BaseService {
  public async getTicket(accessToken: string, type: string) {
    axios.defaults.timeout = 5000
    const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=${type}&access_token=${accessToken}`)
    return data
  }

  public async getAccessToken(wxappid: string, wxsecret: string) {
    const {
      ctx: {
        app: { commonRedis },
        redisKey
      }
    } = this
    const token = await commonRedis.get(redisKey.wx.accessToken(wxappid))
    if (token) {
      return token
    }
    axios.defaults.timeout = 5000
    const { data } = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxappid}&secret=${wxsecret}`
    )
    if (data.access_token) {
      await commonRedis.setex(redisKey.wx.accessToken(wxappid), data.expires_in, data.access_token)
      return data.access_token
    }
    return null
  }

  public async getAccessTokenByOauth2(wxappid: string, wxsecret: string, code: string) {
    const {
      ctx: {
        app: { commonRedis },
        redisKey
      }
    } = this
    axios.defaults.timeout = 5000
    const res = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wxappid}&secret=${wxsecret}&code=${code}&grant_type=authorization_code`
    )
    const data = res.data
    if (data.access_token) {
      // 过期时间是7200秒，设置提前1分钟结束清空掉
      await commonRedis.setex(redisKey.wx.userToken(wxappid, data.openid), data.expires_in - 60, data.access_token)
      // 过期时间是30天，设置提前1分钟结束清空掉
      await commonRedis.setex(redisKey.wx.refreshUserToken(wxappid, data.openid), 30 * 24 * 60 * 60 * 1000 - 60, data.access_token)
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        openid: data.openid
      }
    }
    return null
  }

  public async getAccessTokenByOauth2ByOpenId(wxappid: string, openId: string) {
    const {
      ctx: {
        app: { commonRedis },
        redisKey
      }
    } = this
    const accessToken = await commonRedis.get(redisKey.wx.userToken(wxappid, openId))
    if (!accessToken) {
      const refreshToken = await commonRedis.get(redisKey.wx.refreshUserToken(wxappid, openId))
      if (!refreshToken) {
        return null
      }
      axios.defaults.timeout = 5000
      const { data } = await axios.get(
        `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${wxappid}&grant_type=refresh_token&refresh_token=${refreshToken}`
      )
      console.log('getAccessTokenByOauth2ByOpenId', data)
      if (data.access_token) {
        // 过期时间是7200秒，设置提前1分钟结束清空掉
        await commonRedis.setex(redisKey.wx.userToken(wxappid, openId), data.expires_in - 60, data.access_token)
        // 过期时间是30天，设置提前1分钟结束清空掉
        await commonRedis.setex(redisKey.wx.refreshUserToken(wxappid, openId), 30 * 24 * 60 * 60 - 60, data.access_token)
        return data.access_token
      } else {
        await commonRedis.del(redisKey.wx.refreshUserToken(wxappid, openId))
      }
    }
    return accessToken
  }

  public async getRefreshUserToken(wxappid: string, openId: string) {
    const {
      ctx: {
        app: { commonRedis },
        redisKey
      }
    } = this
    return await commonRedis.get(redisKey.wx.refreshUserToken(wxappid, openId))
  }

  public async getUserInfo(openid: string, accessToken: string) {
    axios.defaults.timeout = 5000
    const { data } = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`)
    if (data.errcode) {
      return null
    }
    return data
  }

  public getOauth2Url(wxappid: string, redirectUri: string, scope: string = 'snsapi_base') {
    redirectUri = encodeURIComponent(redirectUri)
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxappid}&response_type=code&scope=${scope}&state=777&redirect_uri=${redirectUri}#wechat_redirect`
  }

  public async getSDKConfig(url: string, wxappid: string, wxsecret: string) {
    const {
      ctx: {
        app: { commonRedis },
        redisKey
      }
    } = this
    let ticket: any = await commonRedis.get(redisKey.wx.ticketKey(wxappid))
    if (!ticket) {
      const accessToken = await this.getAccessToken(wxappid, wxsecret)
      const data = await this.getTicket(accessToken, 'jsapi')
      if (data.ticket) {
        ticket = data.ticket
        await commonRedis.setex(redisKey.wx.ticketKey(wxappid), data.expires_in, ticket)
      }
    }
    const nonceStr = Math.random().toString(36).slice(2)
    const timestamp = Math.floor(dayjs().unix().now() / 1000)
    const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url.split('#')[0]}`
    const signature = crypto.createHash('sha1').update(str, 'utf8').digest('hex')
    return {
      appId: wxappid,
      timestamp,
      nonceStr,
      signature
    }
  }
}
