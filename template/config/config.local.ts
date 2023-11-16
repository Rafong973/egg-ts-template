import { DefaultConfig, getSqlConfig, getRedisConfig } from './config.default'

export default () => {
  const config: DefaultConfig = {}
  config.jwtSecret = 'kp134bu5ole'
  config.jwtAdminSecret = 'a7s9dfafs8f'
  config.injectSecret = '24haowan@token&24haowan'
  config.setGameConfigSecret = 'meiwayGameConfig'
  config.scheduleEnable = false

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
      common: getRedisConfig({ db: 13 })
    }
  }

  config.logger = {
    dir: './logs',
    level: 'WARN'
  }
  return config
}
