const {
  notEmpty,
  titleUpperCase
} = require('../util.js');

module.exports = {
  description: 'generate a service',
  prompts: [{
    type: 'input',
    name: 'pathName',
    message: '文件路径',
    validate: notEmpty('pathName')
  }],
  actions: (data) => {
    let name = data.pathName.split('/');
    name = name[name.length - 1];
    let tableName = name.replace(/\B([A-Z])/g, (match) => {
      return `_${match.toLowerCase()}`
    })
    tableName = tableName.toLowerCase();
    name = titleUpperCase(name);
    const actions = [{
      type: 'add',
      path: `app/model/<%= database.replace(/(_|-)([a-zA-Z])/g, (match) => { return `${match.toUpperCase()}`.replace(/(_|-)/g, ''); }) -%>/${data.pathName}.ts`,
      templateFile: 'dev-scripts/plop-templates/model/index.hbs',
      data: {
        name,
        tableName
      }
    }];

    return actions;
  }
};
