import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryConstants } from 'src/assets/constants/category.constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public categories:Category[] = [
    {
      name: CategoryConstants.PATIENT,
      image: "assets/images/categories/patients.jpg",
      path: "patients"
    },
    {
      name: CategoryConstants.PHYSICIAN,
      image: "assets/images/categories/physicians.jpg",
      path: "physicians"
    },
    {
      name: CategoryConstants.USER,
      image: "assets/images/categories/users.jpg",
      path: "users"
    }
  ];

  public categoriesHome:Category[] = [
    {
      name: CategoryConstants.PATIENT,
      image: "assets/images/categories/patients.jpg",
      path: "patients"
    },
    {
      name: CategoryConstants.PROGRAM,
      image: "assets/images/categories/surgeries.jpg",
      path: "surgeries"
    },
    {
      name: CategoryConstants.AID,
      image: "assets/images/categories/aids.png",
      path: "aids"
    },
    {
      name: CategoryConstants.PHYSICIAN,
      image: "assets/images/categories/physicians.jpg",
      path: "physicians"
    },
    {
      name: CategoryConstants.HOSPITAL,
      image: "assets/images/categories/hospitals.jpg",
      path: "hospitals"
    },
    {
      name: CategoryConstants.USER,
      image: "assets/images/categories/users.jpg",
      path: "users"
    }
  ];


  constructor() { }

  public getCategories() {
    return this.categories;
  }

  public getCategoriesHome() {
    return this.categoriesHome;
  }
}
