import { Rule, Tree, chain, SchematicContext } from '@angular-devkit/schematics';
import { NodeDependencyType } from 'schematics-utilities';
import { ISchema } from '../interfaces/schema.interface';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import * as cap_utilities from 'cap-utilities';

export function capAngularSchematicLiveChat(_options: ISchema): any {
  return (tree: Tree, _context: SchematicContext) => cap_utilities.setupOptions(tree, _options);
}

export function addPackageJsonDependencies(): Rule {
  return (host: Tree) => cap_utilities.addPackageToPackageJson(host, NodeDependencyType.Default, 'cap-livechat-sf', '~0.0.5');
}

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return host;
  };
}

export function addToRootModule(options: ISchema) {

  return (host: Tree) => cap_utilities.addToNgModule(host, options, [{
    name: 'CapLiveChatModule',
    path: `cap-livechat-sf`,
    type: 'module',
    forRootValues: {
      params: [
        {
          name: 'embeddedServiceName',
          value: `${options.embeddedServiceName}`
        },
        {
          name: 'idServiceName',
          value: `${options.idServiceName}`
        },
        {
          name: 'urlSandbox',
          value: `${options.urlSandbox}`
        },
        {
          name: 'urlDomain',
          value: `${options.urlDomain}`
        },
        {
          name: 'baseLiveAgentContentURL',
          value: `${options.baseLiveAgentContentURL}`
        },
        {
          name: 'deploymentId',
          value: `${options.deploymentId}`
        },
        {
          name: 'buttonId',
          value: `${options.buttonId}`
        },
        {
          name: 'baseLiveAgentURL',
          value: `${options.baseLiveAgentURL}`
        },
        {
          name: 'scriptUrl',
          value: `${options.scriptUrl}`
        },
        {
          name: 'eswLiveAgentDevName',
          value: `${options.eswLiveAgentDevName}`
        }
      ]
    }

  }])
}

export default function (options: ISchema): Rule {
  return chain([
    capAngularSchematicLiveChat(options),
    addPackageJsonDependencies(),
    installPackageJsonDependencies(),
    addToRootModule(options)
  ]);
}