import { Component, OnInit } from '@angular/core';
import { UserConstants } from 'src/assets/constants/users/user.constants';

@Component({
  selector: 'app-user-wrapper',
  templateUrl: './user-wrapper.component.html',
  styleUrls: ['./user-wrapper.component.scss']
})
export class UserWrapperComponent implements OnInit {

  public isExpanded: boolean = false;

  public userConstants = UserConstants;

  constructor() { }

  ngOnInit(): void {
  }

}
