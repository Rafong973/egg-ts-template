import qs from 'qs'
import uuid from 'uuid'
import crypto from 'crypto'
import dayjs, { Dayjs } from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import { SignOptions, Secret } from 'jsonwebtoken'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export default {
  formatTime(time: any = new Date(), format: string = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(time).format(format)
  },
  isSameOrBefore(referenceTime: string, time: Dayjs = dayjs()) {
    return dayjs(time)?.isSameOrBefore(referenceTime)
  },
  isSameOrAfter(referenceTime: string, time: Dayjs = dayjs()) {
    return dayjs(time).isSameOrAfter(referenceTime)
  },
  uuid() {
    return uuid()
  },
  jwtSign(payload: string | Buffer | object, secretOrPrivateKey: Secret = '', options: SignOptions) {
    return jsonwebtoken.sign(payload, secretOrPrivateKey, options)
  },
  jwtVerify(token: string, secretOrPrivateKey: Secret = '', error: any) {
    try {
      return jsonwebtoken.verify(token, secretOrPrivateKey)
    } catch (err) {
      throw error
    }
  },
  wait(duration: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, duration)
    })
  },
  deleteQsSymbol(objQs: string) {
    return objQs.replace(/&|=/g, '')
  },
  // 对象排序
  sortObject(obj: any) {
    const tempObj: any = {}
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        tempObj[key] = obj[key]
      })
    return tempObj
  },
  // sha1加密
  sha1(input: string) {
    return crypto.createHash('sha1').update(input, 'utf8').digest('hex')
  },
  // 字符串参数排序
  sortParamStr(paramStr: string) {
    const arr = paramStr.split('&')
    arr.sort((a, b) => {
      if (a > b) {
        return 1
      }
      if (a < b) {
        return -1
      }
      return 0
    })
    return arr.join('&')
  },
  qs(obj: any) {
    return qs.stringify(obj)
  },
  getFileExt(fileName: string) {
    const splitArr = fileName.split('.')
    if (splitArr.length > 1) {
      return splitArr[splitArr.length - 1]
    } else {
      return ''
    }
  }
}
