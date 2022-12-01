import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { UserConstants } from 'src/assets/constants/users/user.constants';
import { UserColumnsConstants } from 'src/assets/constants/users/userColumns.constants';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public dataSource = new MatTableDataSource<User>();
  public paginator!: MatPaginator;
  public userConstants = UserConstants;
  public commonConstants = CommonConstants;

  public columns = [
    {
      columnDef: 'name',
      header: UserColumnsConstants.NAME,
      cell: (element: User) => `${element.name}`,
    },
    {
      columnDef: 'firstLastName',
      header: UserColumnsConstants.FIRSTLASTNAME,
      cell: (element: User) => `${element.firstLastName}`,
    },
    {
      columnDef: 'secondLastName',
      header: UserColumnsConstants.SECONDLASTNAME,
      cell: (element: User) => `${element.secondLastName}`,
    },
    {
      columnDef: 'dateOfBirth',
      header: UserColumnsConstants.DATEBIRTH,
      cell: (element: User) => `${element.dateOfBirth}`,
    },
    {
      columnDef: 'email',
      header: UserColumnsConstants.EMAIL,
      cell: (element: User) => `${element.email}`,
    },
    {
      columnDef: 'role',
      header: UserColumnsConstants.ROLE,
      cell: (element: User) => `${element.role == 'admin' ? 'administrador' : 'usuario'}`,
    },
  ];

  public displayedColumns = this.columns.map(c => c.columnDef);

  constructor(public userService: UserService, public router: Router) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  
  ngOnInit(): void {
    this.getUsers();
  }

  public setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  public getUsers(): void {
    this.userService.getUsers()
    .subscribe(users => this.dataSource = new MatTableDataSource<User>(users));
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public showUser(user: User): void {
    this.router.navigate(['users/show-user', user.id]);
  }

  public addUser() {
    this.router.navigate(['users/new']);
  }
}
