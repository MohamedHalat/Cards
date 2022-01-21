import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ContextMenuModule} from 'primeng/contextmenu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldComponent } from './components/world/world.component';
import { OverlayComponent } from './components/overlay/overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    OverlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ContextMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
