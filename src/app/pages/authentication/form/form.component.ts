import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AxiosService } from '../../../services/axios.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserActiveService } from '../../../services/user-active.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  errorMessage = signal('');

  constructor(
    private formBuilder: FormBuilder, 
    private axiosService: AxiosService,
    private userActiveService: UserActiveService
  
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.formBuilder.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required]]
    });

    this.registerForm = this.formBuilder.group({
      registerFirstName: ['', [Validators.required]],
      registerLastName: ['', [Validators.required]],
      registerEmail: ['', [Validators.required, Validators.email]],
      registerPassword: ['', [Validators.required]],
    });
  }

  // Password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Submit Login
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.loginEmail;
      const password = this.loginForm.value.loginPassword;

      this.axiosService
        .request('POST', '/login', {
          login: email,
          password: password,
        })
        .then((response) => {
          this.axiosService.setAuthToken(response.data.token);
          this.userActiveService.setSelectedUser(response.data);
        })
        .catch((error) => {
          this.axiosService.setAuthToken(null);
        });
    }
  }

  // Submit Register
  onRegisterSubmit(): void {

    if (this.registerForm.valid) {
      const registerFirstName = this.registerForm.value.registerFirstName;
      const registerLastName = this.registerForm.value.registerLastName;
      const registerEmail = this.registerForm.value.registerEmail;
      const registerPassword = this.registerForm.value.registerPassword;

      this.axiosService.request(
		    "POST",
		    "/register",
		    {
		        firstName: registerFirstName,
		        lastName: registerLastName,
		        login: registerEmail,
		        password: registerPassword
		    }).then(
		    response => {
		        this.axiosService.setAuthToken(response.data.token);
            this.userActiveService.setSelectedUser(response.data);
		    }).catch(
		    error => {
		        this.axiosService.setAuthToken(null);
		    }
		);
    }
  }

  // Tab Change
  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.loginForm.reset();
    } else if (event.index === 1) {
      this.registerForm.reset();
    }
  }
  
}
