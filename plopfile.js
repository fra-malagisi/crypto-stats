module.exports = function (plop) {
  plop.setPrompt('loop', require('inquirer-recursive'));
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the component name?',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'name is required';
        },
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is the path of the component ?',
      },
      {
        type: 'confirm',
        name: 'hasProps',
        message: 'Does the component have props?',
        default: 'n',
      },
      {
        when: function (response) {
          return response.hasProps;
        },
        type: 'input',
        name: 'propsType',
        message: 'What is the props type?',
      },
      {
        when: function (response) {
          return response.hasProps;
        },
        type: 'loop',
        message: 'Do you want to show a prop property in the component?',
        name: 'props',
        prompts: [
          {
            type: 'input',
            name: 'name',
            message: 'What is property name?',
            validate: function (value) {
              if (/.+/.test(value)) {
                return true;
              }
              return 'name is required';
            },
          },
          {
            type: 'input',
            name: 'type',
            message: 'What is the name of the property?',
            validate: function (value) {
              if (/.+/.test(value)) {
                return true;
              }
              return 'type is required';
            },
          },
        ],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{path}}/{{dashCase name}}/{{dashCase name}}.component.tsx',
        templateFile: 'plop-templates/Component.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{path}}/{{dashCase name}}/index.ts',
        templateFile: 'plop-templates/Index.js.hbs',
      },
    ],
  });

  plop.setHelper('getTypesFromProps', (arr, options) => {
    arrWithoutDuplicates = [];
    arr.forEach((prop) => {
      if (
        prop.type !== 'string' &&
        prop.type !== 'number' &&
        prop.type !== 'boolean' &&
        prop.type !== 'null' &&
        prop.type !== 'undefined' &&
        !arrWithoutDuplicates.some((type) => type === prop.type)
      ) {
        arrWithoutDuplicates.push(prop.type);
      }
    });
    return arrWithoutDuplicates.map((prop) => options.fn(prop)).join('');
  });
};
