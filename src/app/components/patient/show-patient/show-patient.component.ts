import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientConstants } from 'src/assets/constants/patients/patient.constants';

@Component({
  selector: 'app-show-patient',
  templateUrl: './show-patient.component.html',
  styleUrls: ['./show-patient.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ShowPatientComponent implements OnInit {

  public tabs = PatientConstants;
  public id!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
  }

}
