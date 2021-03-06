import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToxicityPipe } from './toxicity.pipe';
import { EmojifyPipe } from './emojify.pipe';

@NgModule({
  declarations: [AppComponent, ToxicityPipe, EmojifyPipe],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
