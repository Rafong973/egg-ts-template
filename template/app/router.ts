import { Application, Context } from 'egg'
import { HwRouter } from './lib/hwRouter'

export default (app: Application) => {
  // 自动注入路由
  HwRouter(app)

  app.get('/', (res: Context) => {
    res.state.html = true
    res.body = 'hi egg'
  })
}
