require('module-alias/register')
import BaseService from '@base/baseService'
import { Context } from 'egg'
import * as oss from 'ali-oss'
import OSS = require('ali-oss')
import * as fs from 'fs'
const images = require('images')

export default class OssService extends BaseService {
  private ossConfig = this.app.config.aliyun.oss
  private region: string = 'oss-cn-shenzhen'
  private store: OSS | null = null

  constructor(ctx: Context) {
    super(ctx)
    this.store = new oss({
      accessKeyId: this.ossConfig.accessKeyId,
      accessKeySecret: this.ossConfig.accessKeySecret,
      bucket: this.ossConfig.bucket,
      region: this.region
    })
  }

  /**
   * 上传文件
   */
  async uploadFile(file: any) {
    const localFile = file.filepath
    const ext = this.ctx.helper.getFileExt(file.filename)
    const originalname = `file/common/${this.ctx.helper.uuid()}.${ext}`
    const link = await this.ossUpload(originalname, localFile)
    return link
  }

  /**
   * 上传指定路径的文件
   */
  public async ossUpload(name: string, filePath: string) {
    if (!this.store) {
      return
    }
    await this.store.put(name, filePath)
    fs.unlinkSync(filePath)
    return 'https://statics.meiway.cc/' + name
  }

  /**
   * 上传buffer流的文件
   */
  async uploadFromBuffer(dataBuffer: Buffer) {
    const name = `file/case-show/${this.ctx.helper.uuid()}`
    const dir = './cacheFile'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    const path = `${dir}/${name}`
    fs.writeFileSync(path, dataBuffer)
    return await this.ossUpload(name, path)
  }

  public async uploadAndCompressImg(file: any, quality?: number) {
    const localFile = file.filepath
    images(localFile).save(localFile, {
      quality: quality || 80 // 默认图片质量为80;
    })
    return this.uploadFile(file)
  }
}
