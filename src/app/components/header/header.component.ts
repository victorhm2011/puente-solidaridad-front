import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  @Input() public isHome!: Boolean;

  public categories!: Category[];

  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    this.categories = this.homeService.getCategories();
  }

}
