import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tab: 'add' | 'view' | 'edit' = 'add';

  addForm!: FormGroup;
  editForm!: FormGroup;

  records!: Array<{
    id: String;
    patientName: String;
    nhiNumber: String;
    contactNumber: String;
    vaccineType: String;
    dueDate: Date;
    reminderStatus: String;
    vaccinatedDate: Date;
  }>;

  get addFrm() {
    return this.addForm.controls;
  }

  get editFrm() {
    return this.editForm.controls;
  }

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.addForm = this.fb.group({
      patientName: [null, Validators.required],
      nhiNumber: [null, Validators.required],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern(/^64(2\d{7,9})$/)],
      ],
      vaccineType: [null, Validators.required],
      dueDate: [null, Validators.required],
    });
    this.editForm = this.fb.group({
      id: [null, Validators.required],
      patientName: [null, Validators.required],
      nhiNumber: [null, Validators.required],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern(/^64(2\d{7,9})$/)],
      ],
      vaccineType: [null, Validators.required],
      dueDate: [null, Validators.required],
      reminderStatus: [null, Validators.required],
      vaccinatedDate: [null],
    });

    this.populateRecords();
  }

  private resetForm() {
    this.addForm.reset({
      patientName: null,
      nhiNumber: null,
      contactNumber: null,
      vaccineType: null,
      dueDate: null,
    });
    this.editForm.reset({
      patientName: null,
      nhiNumber: null,
      contactNumber: null,
      vaccineType: null,
      dueDate: null,
      reminderStatus: null,
      vaccinatedDate: null,
    });
  }

  private async populateRecords() {
    try {
      const response = await axios.get(
        'https://sms-demo-fszn.onrender.com/vaccine-records'
      );
      this.records = response.data.rows.map((record: any) => ({
        id: record.id,
        patientName: record.patient_name,
        nhiNumber: record.nhi_number,
        contactNumber: record.contact_number,
        vaccineType: record.vaccine_type,
        dueDate: new Date(record.due_date),
        reminderStatus: record.reminder_status,
        vaccinatedDate: record.vaccinated_date
          ? new Date(record.vaccinated_date)
          : null,
      }));
    } catch (error) {
      console.error('Error loading vaccine records:', error);
    }
  }

  onClickAddPatient() {
    this.tab = 'add';
  }

  onClickViewAllRecords() {
    this.tab = 'view';
  }

  onClickEditRecord(record: any) {
    this.tab = 'edit';
    this.editForm.patchValue({
      id: record.id,
      patientName: record.patientName,
      nhiNumber: record.nhiNumber,
      contactNumber: record.contactNumber,
      vaccineType: record.vaccineType,
      dueDate: record.dueDate?.toISOString().split('T')[0],
      reminderStatus: record.reminderStatus,
      vaccinatedDate: record.vaccinatedDate?.toISOString().split('T')[0],
    });
  }

  onClickCancel() {
    this.tab = 'view';
    this.resetForm();
  }

  async onSubmitAddForm() {
    this.spinner.show();
    const payload = {
      patientName: this.addFrm['patientName'].value,
      nhiNumber: this.addFrm['nhiNumber'].value,
      contactNumber: this.addFrm['contactNumber'].value,
      vaccineType: this.addFrm['vaccineType'].value,
      dueDate: this.addFrm['dueDate'].value,
      reminderStatus: 'Scheduled',
    };

    try {
      const response = await axios.post(
        'https://sms-demo-fszn.onrender.com/vaccine-records',
        payload
      );
      alert(response.data.message);
      this.spinner.hide();
      this.resetForm();
      this.populateRecords();
      this.onClickViewAllRecords();
    } catch (error: any) {
      alert('Error scheduling SMS: ' + error.message);
      this.spinner.hide();
    }
  }

  async onSubmitEditForm() {
    this.spinner.show();
    const payload = {
      id: this.editFrm['id'].value,
      patientName: this.editFrm['patientName'].value,
      nhiNumber: this.editFrm['nhiNumber'].value,
      contactNumber: this.editFrm['contactNumber'].value,
      vaccineType: this.editFrm['vaccineType'].value,
      dueDate: this.editFrm['dueDate'].value,
      reminderStatus: this.editFrm['reminderStatus'].value,
      vaccinatedDate: this.editFrm['vaccinatedDate'].value,
    };

    try {
      const response = await axios.post(
        'https://sms-demo-fszn.onrender.com/vaccine-records',
        payload
      );
      alert(response.data.message);
      this.resetForm();
      this.populateRecords();
      this.onClickViewAllRecords();
      this.spinner.hide();
    } catch (error: any) {
      alert('Error scheduling SMS: ' + error.message);
      this.spinner.hide();
    }
  }
}
