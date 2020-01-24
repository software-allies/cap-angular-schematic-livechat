import { apply, MergeStrategy, mergeWith, Rule, move, SchematicContext, Tree, template, url, forEach, FileEntry, chain, noop, SchematicsException } from '@angular-devkit/schematics';
import { join, normalize } from 'path';
import { getWorkspace, getAppModulePath, getProjectFromWorkspace, addImportToModule } from 'schematics-utilities';
import { getProjectMainFile, getSourceFile } from 'schematics-utilities/dist/cdk';
export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src/app/modules/cap-livechat');
  return host;
}
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function capAngularSchematicLivechat(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);
    const movePath = normalize(_options.path + '/');
    const templateSource = apply(url('./files'), [
      template({
        ..._options
      }),
      move(movePath),
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      }),
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
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
    addToRootModule(host, modulePath, moduleName, './modules/cap-livechat/cap-live-chat.module', options)
    return host;
  };
}

export default function (options: any): Rule {
  return chain([
    options && options.skipModuleImport ? noop() : capAngularSchematicLivechat(options),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
  ]);
}

export function addToRootModule(host: Tree, modulePath: string, moduleName: string, src: string, options?: any) {

  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
  console.log('changes: ', changes[0]);
  let recorder = host.beginUpdate(modulePath);
  
  changes.forEach((change: any) => {
    // if (change instanceof InsertChange) {
      if(change.toAdd){
        if (change.toAdd === ',\n    CapLiveChatModule') {
          change.toAdd = `,\n    CapLiveChatModule.forRoot({
              embeddedServiceName: '${options.embeddedServiceName}',
              idServiceName: '${options.idServiceName}',
              urlSandbox: '${options.urlSandbox}',
              urlDomain: '${options.urlDomain}',
              baseLiveAgentContentURL: '${options.baseLiveAgentContentURL}',
              deploymentId: '${options.deploymentId}',
              buttonId: '${options.buttonId}',
              baseLiveAgentURL: '${options.baseLiveAgentURL}',
              scriptUrl: '${options.scriptUrl}'
            })`;
        }
        recorder.insertLeft(change.pos, change.toAdd);
      }

    // }
  });
  host.commitUpdate(recorder);

  return host
}