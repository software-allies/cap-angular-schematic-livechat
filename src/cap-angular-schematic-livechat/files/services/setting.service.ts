import { Injectable, Optional } from '@angular/core';

export interface IConfig {
  embeddedServiceName: string;
  idServiceName: string;
  urlSandbox: string;
  urlDomain: string;
  baseLiveAgentContentURL: string;
  deploymentId: string;
  buttonId: string;
  baseLiveAgentURL: string;
  scriptUrl: string;
}

@Injectable()

export class SettingService {
  embeddedServiceName: string;
  idServiceName: string;
  urlSandbox: string;
  urlDomain: string;
  baseLiveAgentContentURL: string;
  deploymentId: string;
  buttonId: string;
  baseLiveAgentURL: string;
  scriptUrl: string;

  constructor(@Optional() config: IConfig) {
    if (config) {
      this.embeddedServiceName = '<%= embeddedServiceName %>';
      this.idServiceName = '<%= idServiceName %>';
      this.urlSandbox = '<%= urlSandbox %>';
      this.urlDomain = '<%= urlDomain %>';
      this.baseLiveAgentContentURL = '<%= baseLiveAgentContentURL %>';
      this.deploymentId = '<%= deploymentId %>';
      this.buttonId = '<%= buttonId %>';
      this.baseLiveAgentURL = '<%= baseLiveAgentURL %>';
      this.scriptUrl = '<%= scriptUrl %>';
    }
  }
}