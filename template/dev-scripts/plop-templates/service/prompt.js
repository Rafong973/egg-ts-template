const { notEmpty, titleUpperCase } = require('../util.js');

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
    const path = name;
    const names = name.split('-');
    name = '';
    for (const n of names) {
      name += titleUpperCase(n);
    }
    const actions = [
      {
        type: 'add',
        path: `app/service/${data.pathName}.ts`,
        templateFile: 'dev-scripts/plop-templates/service/index.hbs',
        data: {
          name,
          path
        }
      },
      {
        type: 'add',
        path: `app/schema/service/${data.pathName}.ts`,
        templateFile: 'dev-scripts/plop-templates/service/schema.hbs',
        data: {}
      }
    ];

    return actions;
  }
};