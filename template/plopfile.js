const routerGenerator = require('./dev-scripts/plop-templates/router/prompt')
const serviceGenerator = require('./dev-scripts/plop-templates/service/prompt')
const modelGenerator = require('./dev-scripts/plop-templates/model/prompt')

module.exports = function (plop) {
  plop.setGenerator('router', routerGenerator)
  plop.setGenerator('service', serviceGenerator)
  plop.setGenerator('model', modelGenerator)
}
