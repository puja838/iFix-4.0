import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  EmailFormatError = 'Email format not valid';
  EmailOrPhoneFormatError = 'Email id or phone number not valid';

  constructor() { }

  ValidateEmail(email) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }

  ValidatePhoneno(phone) {
    const phoneno = /^\d{10}$/;
    if (phone.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  }

}
