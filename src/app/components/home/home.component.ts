import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public categories!: Category[];

  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    this.categories = this.homeService.getCategoriesHome();
  }

}
