import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: {
    class: 'flex p-4 space-x-2 items-center',
  },
})
export class AppComponent {
  text = 'Hello Angular!';
}
