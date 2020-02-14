import { Rule, Tree, chain, SchematicContext, SchematicsException } from '@angular-devkit/schematics';
import { join, normalize } from 'path';
import { getWorkspace, NodeDependencyType, NodeDependency, addPackageJsonDependency, getProjectFromWorkspace, getAppModulePath, addImportToModule } from 'schematics-utilities';
import { ISchema } from '../interfaces/schema.interface';
import { getProjectMainFile, getSourceFile } from 'schematics-utilities/dist/cdk';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src/app/modules/cap-livechat');
  return host;
}


export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '~0.0.2', name: 'cap-livechat' },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function addModuleToImports(options: any): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    const moduleName = 'CapLiveChatModule';
    addToRootModule(host, modulePath, moduleName, 'cap-livechat-sf', options)
    return host;
  };
}

export function addToRootModule(host: Tree, modulePath: string, moduleName: string, src: string, options?: any) {

  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
  let recorder = host.beginUpdate(modulePath);

  changes.forEach((change: any) => {
    // if (change instanceof InsertChange) {
    if (change.toAdd === ',\n    CapLiveChatModule') {
      change.toAdd = `,\n    
    CapLiveChatModule.forRoot({
      embeddedServiceName: '${options.embeddedServiceName}',
      idServiceName: '${options.idServiceName}',
      urlSandbox: '${options.urlSandbox}',
      urlDomain: '${options.urlDomain}',
      baseLiveAgentContentURL: '${options.baseLiveAgentContentURL}',
      deploymentId: '${options.deploymentId}',
      buttonId: '${options.buttonId}',
      baseLiveAgentURL: '${options.baseLiveAgentURL}',
      scriptUrl: '${options.scriptUrl}',
      eswLiveAgentDevName: '${options.eswLiveAgentDevName}'
    })`;
    }
    recorder.insertLeft(change.pos, change.toAdd);

    // }
  });
  host.commitUpdate(recorder);

  return host
}


export default function (options: ISchema): Rule {
  return chain([
    addPackageJsonDependencies(),
    addModuleToImports(options)
  ]);
}