import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ToastrComponent } from '../../extra-component/toastr/toastr.component';

declare var require: any;
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.css'],
})
export class DatatableComponent implements OnInit {
  editing = {};
  rows = [];
  data: any = [];
  temp = [...this.data];
  usersJson: any;

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'id' }, { name: 'role' }];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private auth: AuthenticationService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('role') !== 'admin') {
      this.logout();
    }
    this.users();
  }

  users() {
    this.auth.users()
      .then(
        res => {
          this.usersJson = res;
          for (let i = 0; i < res.allUsers.length; i++) {
            // console.log('engji' + res.allUsers[i].name);
            this.data.push({
              'id': res.allUsers[i]._id,
              'nome': res.allUsers[i].name,
              'genere': res.allUsers[i].gender,
              'ruolo': res.allUsers[i].permission
            });
          }
          this.rows = this.data;
          this.temp = [...this.data];
          setTimeout(() => {
            this.loadingIndicator = false;
          }, 1500);
        },
        error => console.log(error));
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.nome.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }
  updateValue(event, cell, rowIndex) {
    // console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    // console.log('UPDATED!', this.rows[rowIndex]['role']);
    // console.log(' id', this.rows[rowIndex]['id']);
    const data = {
      '_id': this.rows[rowIndex]['id'],
      'permission': this.rows[rowIndex][cell]
    };
    this.auth.changeRole(data)
      .then(res => {
        this.toastr.success('You changed role of ' + this.rows[rowIndex]['nome'] + ' to ' + this.rows[rowIndex][cell]);
      },
        error => this.toastr.error('Could not change role, please try again!')
      );
  }
  logout() {
    window.localStorage.clear();
    document.location.href = '/#/signup2';
  }
}
