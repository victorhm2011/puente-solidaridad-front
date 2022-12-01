import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physician-wrapper',
  templateUrl: './physician-wrapper.component.html',
  styleUrls: ['./physician-wrapper.component.scss']
})
export class PhysicianWrapperComponent implements OnInit {

  isExpanded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
