import { DefaultConfig, getSqlConfig, getRedisConfig } from './config.default'

export default () => {
  const config: DefaultConfig = {}

  config.jwtSecret = process.env.JWT_SECRET || 'kp134bu5ole'
  config.jwtAdminSecret = process.env.JWT_ADMIN_SECRET || 'a7s9dfafs8f'
  config.injectSecret = process.env.INJECT_SECRET || '24haowan@token&24haowan'
  config.setGameConfigSecret = 'meiwayGameConfig'
  config.scheduleEnable = process.env.SCHEDULEENABLE === 'true'

  config.sequelize = {
    datasources: [
      getSqlConfig({
        delegate:
          "model.<%= database.replace(/(_|-)([a-zA-Z])/g, (match) => {return `${match.toUpperCase()}`.replace(/(_|-)/g, '');}) -%>Model",
        baseDir: "model/<%= database.replace(/(_|-)([a-zA-Z])/g, (match) => {return `${match.toUpperCase()}`.replace(/(_|-)/g, '');}) -%>",
        database: '<%= database -%>'
      })
    ]
  }

  config.redis = {
    clients: {
      common: getRedisConfig({ db: 0 })
    }
  }

  config.logger = {
    dir: './logs',
    level: 'INFO'
  }
  return config
}
