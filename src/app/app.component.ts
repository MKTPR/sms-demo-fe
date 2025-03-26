import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule],
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  users = [
    { name: 'John Doe', phone: '64210391408' },
    { name: 'Jane Smith', phone: '+0987654321' },
  ];

  sendSms(phoneNumber: string) {
    axios
      .post('https://sms-demo-fszn.onrender.com/send-sms', {
        phoneNumber,
        message: 'ClinicallyAI',
      })
      .then((response) => {
        alert('SMS Sent Successfully!');
      })
      .catch((error) => {
        alert('Error sending SMS: ' + error.message);
      });
  }
}
