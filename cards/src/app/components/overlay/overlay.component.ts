import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Output() addToHand = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  clicked() {
    this.addToHand.emit();
  }

}
