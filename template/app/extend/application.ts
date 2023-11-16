import { Context, Singleton, Application } from 'egg'
import { Redis } from 'ioredis'

/**
 * 扩展application
 */
export default {
  get commonRedis() {
    return ((this as Application).redis as Singleton<Redis>).get('common')
  }
}
