import { Component } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';
import { AuthenticationService, LoginPayload } from '../../../services/authentication.service';

declare var require: any;

interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  constructor(private auth: AuthenticationService) {
    this.users();
  }
  arrayUsers = [];
  count = 0;
  noncount = 0;
  user = 0;
  professional = 0;
  ambassador = 0;
  msg = localStorage.getItem('msgLength');
  data: any = [];
  chartData: any;
  lineChart: Chart;

  users() {
    this.auth.users()
      .then(
        res => {
          localStorage.setItem('nonactiveUsers', res.nonActiveUsers);
          localStorage.setItem('activeUsers', res.activeUsers);
          for (let i = 0; i < res.allUsers.length; i++) {
            if (res.allUsers[i].active === true) {
            this.count++;
            }
            if (res.allUsers[i].active === false) {
              this.noncount++;
              }
            if (res.allUsers[i].permission === 'user') {
              this.user++;
            }
            if (res.allUsers[i].permission === 'ambassador') {
              this.ambassador++;
            }
            if (res.allUsers[i].permission === 'professional') {
              this.professional++;
            }
            this.arrayUsers.push({
              'id': res.allUsers[i]._id,
              'name': res.allUsers[i].name,
              'gender': res.allUsers[i].gender,
              'role': res.allUsers[i].permission,
              'length': res.allUsers.length,
              'active': this.count,
            });
          }
          this.graph();
        },
        error => console.log(error));
  }

  graph() {
    this.data = {
      'Line': {
        'labels': [1, 2],
        'series': [[0, localStorage.getItem('nonactiveUsers')], [0, localStorage.getItem('activeUsers')]]
      }
    };
    this.lineChart = {
      type: 'Line',
      data: this.data['Line'],
      options: {
        low: 0,
        high: 28,
        showArea: true,
        fullWidth: true,
        axisY: {
          onlyInteger: true,
          scaleMinSpace: 40,
          offset: 20,
          labelInterpolationFnc: function(value: number): string {
            return value / 1 + 'k';
          }
        }
      }
    };
  }

}
