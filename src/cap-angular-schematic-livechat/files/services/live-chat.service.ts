import { Injectable, Optional } from '@angular/core';



@Injectable()
export class LiveChatService {
  embeddedServiceName: string;
  idServiceName: string;
  urlSandbox: string;
  urlDomain: string;
  baseLiveAgentContentURL: string;
  deploymentId: string;
  buttonId: string;
  baseLiveAgentURL: string;
  scriptUrl: string;
  configurations: any;

  constructor() {

  }
}