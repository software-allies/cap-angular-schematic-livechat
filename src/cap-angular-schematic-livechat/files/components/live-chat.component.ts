import { Component, OnInit, Inject, PLATFORM_ID, NgZone, Optional } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { SettingService } from '../services/setting.service'

declare var window: any;
declare var embedded_svc: any;

@Component({
  selector: 'cap-live-chat-sf',
  template: '',
  styles: [
    `
      #liveAgentClientChat .liveAgentStateWaiting {
        background-color: #b80325 !important;
        border: none !important;
      }
      
      #waitingMessage {
        height: 100% !important;
        width: 100% !important;
        vertical-align: middle !important;
        text-align: center !important;
        display: none !important;
      }
      #liveAgentClientChat .liveAgentStateWaiting #waitingMessage {
        display: table !important;
      }
      #liveAgentSaveButton {
        z-index: 2 !important;
        width: 100px !important;
      }
      .liveAgentChatElement .liveAgentEndButton {
        z-index: 2 !important;
        width: 100px !important;
      }
      .liveAgentChatElement {
        font-family: Calibri !important;
        font-size: 1.5em !important;
      }
      .liveAgentChatInput {
        height: 25px !important;
        border-width: 1px !important;
        border-style: solid !important;
        border-color: $color-black !important;
        padding: 2px 0 2px 4px !important;
        background: $color-white !important;
        display: block !important;
        width: 99% !important;
      }
      .liveAgentSendButton {
        display: block !important;
        width: 60px !important;
        height: 31px !important;
        padding: 0 0 3px !important;
        position: absolute !important;
        top: 0 !important;
        right: -67px !important;
      }
      #liveAgentChatLog {
        width: auto !important;
        height: auto !important;
        top: 0px !important;
        position: absolute !important;
        overflow-y: auto !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
      }
      .embeddedServiceHelpButton .helpButton .uiButton {
        background-color: #b80325 !important;
        font-family: "Arial", sans-serif;
      }
      .embeddedServiceHelpButton .helpButton {
        right: 32px !important;
      }
    `
  ]
})
export class ChatComponent implements OnInit {
  scriptUrl: string;
  // settingS: any
  constructor(
    public settingService: SettingService,
    
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    ) {
    this.scriptUrl = settingService.scriptUrl
  }

  ngOnInit() {
    console.log('settingService: ', this.settingService);
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const initESW =  (gslbBaseURL:any) =>{
          embedded_svc.settings.displayHelpButton = true; // Or false
          embedded_svc.settings.language = ''; // For example, enter 'en' or 'en-US'
          embedded_svc.settings.enabledFeatures = ['LiveAgent'];
          embedded_svc.settings.entryFeature = 'LiveAgent';
          embedded_svc.init(
            this.settingService.urlSandbox,
            this.settingService.urlDomain,
            gslbBaseURL,
            this.settingService.idServiceName,
            this.settingService.embeddedServiceName, {
            baseLiveAgentContentURL: this.settingService.baseLiveAgentContentURL,
            deploymentId: this.settingService.deploymentId,
            buttonId: this.settingService.buttonId,
            baseLiveAgentURL: this.settingService.baseLiveAgentURL,
            eswLiveAgentDevName: 'EmbeddedServiceLiveAgent_Parent04I0j000000CaRvEAK_16c91587c78',
            isOfflineSupportEnabled: false
          }
          );
        };
        if (!window.embedded_svc) {
          const s = this.document.createElement('script');
          s.setAttribute('src', this.scriptUrl);
          s.onload = function () {
            initESW(null);
          };
          this.document.body.appendChild(s);
        } else {
          initESW('https://service.force.com');
        }
      });
    }
  }

}
