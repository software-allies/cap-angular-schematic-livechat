import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './components/live-chat.component'

import { LiveChatService } from './services/live-chat.service';
import { SettingService, IConfig} from './services/setting.service'

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    ChatComponent,
  ],
  declarations: [
    ChatComponent
  ],
  providers: [LiveChatService],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})
export class CapLiveChatModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: CapLiveChatModule,
      providers: [
        {
          provide: SettingService,
          useValue: config
        }
      ]
    }
  }
}
