import { Context, Application } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      disable: !app.config.scheduleEnable,
      type: 'worker',
      // cron: '00 18 12 18 05 *'//定时执行任务
      immediate: true // 项目启动就执行一次定时任务
    },
    async task(ctx: Context) {
      console.log('test scuedule run')
    }
  }
}
