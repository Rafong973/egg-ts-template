import { Application } from 'egg'
import { HwRouter } from './lib/hwRouter'

export default (app: Application) => {
  // 自动注入路由
  HwRouter(app)
}
