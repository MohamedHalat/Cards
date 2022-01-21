import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ContextMenuModule} from 'primeng/contextmenu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
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
