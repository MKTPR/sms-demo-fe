import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  form = new FormGroup({
    vaccinations: new FormArray([
      new FormGroup({
        name: new FormControl(''),
        dobDay: new FormControl('1'),
        dobMonth: new FormControl('1'),
        dobYear: new FormControl('2000'),
        contact: new FormControl(''),
        vaccineType: new FormControl('HPV 1st'),
        dueDay: new FormControl('1'),
        dueMonth: new FormControl('1'),
        dueYear: new FormControl('2025'),
        status: new FormControl('Pending'),
        sent: new FormControl(false),
      }),
    ]),
  });

  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];
  dobYears = Array.from({ length: 50 }, (_, i) => 1976 + i);
  dueYears = Array.from({ length: 5 }, (_, i) => 2024 + i);

  get vaccinationControls() {
    return this.form.get('vaccinations') as FormArray;
  }

  addRow() {
    this.vaccinationControls.push(
      new FormGroup({
        name: new FormControl(''),
        dobDay: new FormControl('1'),
        dobMonth: new FormControl('1'),
        dobYear: new FormControl('2000'),
        contact: new FormControl(''),
        vaccineType: new FormControl('HPV 1st'),
        dueDay: new FormControl('1'),
        dueMonth: new FormControl('1'),
        dueYear: new FormControl('2025'),
        status: new FormControl('Pending'),
        sent: new FormControl(false),
      })
    );
  }

  onChangeVaccineType(index: number) {
    const row = this.vaccinationControls.at(index);

    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + 6);

    const day = futureDate.getDate();
    const month = futureDate.getMonth() + 1; // Months are 0-indexed
    const year = futureDate.getFullYear();
    console.log(year);

    row.patchValue({ dueDay: day });
    row.patchValue({ dueMonth: month });
    row.patchValue({ dueYear: year });
  }

  sendSms(index: number) {
    const row = this.vaccinationControls.at(index);
    console.log('Sending SMS to:', row.value.contact);
    if (!row.value.contact) return;
    axios
      .post('https://sms-demo-fszn.onrender.com/send-sms', {
        phoneNumber: row.value.contact,
        message: `Hi ${row.value.name}

You're one step closer to full ${row.value.vaccineType} protection!
Your second dose is due.
Book your appointment at www.pakurangaUniChem.com or walk in anytime

Kind regards,
Pakuranga Unichem`,
      })
      .then((response) => {
        alert('SMS Sent Successfully!');
        row.patchValue({ sent: true });
      })
      .catch((error) => {
        alert('Error sending SMS: ' + error.message);
      });
  }
}
