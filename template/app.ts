import { Application, IBoot } from 'egg'
import { ClusterOptions } from 'egg-redis'

export default class FooBoot implements IBoot {
  private readonly app: Application

  constructor(app: Application) {
    this.app = app
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have loaded.
  }

  async didLoad() {}

  async willReady() {
    // All plugins have started, can do some thing before app ready.
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }
  beforeStart() {}

  async serverDidReady() {
    // Server is listening.
    const config = this.app.config

    console.log(config)
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}
declare module 'egg' {
  interface Application {
    commonRedis: ClusterOptions
  }
}
