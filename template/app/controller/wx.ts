require('module-alias/register')
import BaseController from '@base/baseController'
import { HwController, GET } from '@lib/hwRouter'
const __CURCONTROLLER = __filename.substr(__filename.indexOf('/app/controller')).replace('/app/controller', '').split('.')[0].toLowerCase()

@HwController(__CURCONTROLLER)
export default class wxController extends BaseController {
  // 返回微信校验文件
  @GET('/jjkh0e5nx1.txt')
  public async mini() {
    this.returnSuccess('d2f0c0709fa44cf3ffa17646917a7aa0', true)
  }
}
