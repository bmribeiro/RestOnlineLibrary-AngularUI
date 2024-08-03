import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserActiveService } from '../../../services/user-active.service';
import { AuthService } from '../../../services/auth.service';
import { LoginFormData } from '../../../models/login-form-data';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { RegisterFormData } from '../../../models/register-form-data';

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
    private authService: AuthService,
    private userActiveService: UserActiveService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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

      // Login Form Data
      const loginFormData: LoginFormData = this.loginForm.value;

      this.authService.request('post', '/login', { 

          email: loginFormData.email,
          password: loginFormData.password
      })
      .subscribe(
        (response) => {

          console.log("Login com Sucesso " + JSON.stringify(response));

          this.authService.setAuthToken(response.token);
          this.userActiveService.setSelectedUser(response);

          // Redirect to: Home
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // Submit Register
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      // Register Form Data
      const registerFormData: RegisterFormData = this.registerForm.value;

      console.log(registerFormData);

      // Usando o método request do AuthService
      this.authService
        .request('post', '/register', {

          firstName: registerFormData.firstName,
          lastName: registerFormData.lastName,
          email: registerFormData.email,
          password: registerFormData.password
        })
        .subscribe(
          (response) => {
            this.authService.setAuthToken(response.token);
            this.userActiveService.setSelectedUser(response);

            // Redirect to: Home
            this.router.navigate(['/home']);

            //
            this.notificationService.sendMessage('Successfully Deleted Book');
          },
          (error) => {
            this.authService.setAuthToken(null);
            console.error('Registration error', error);
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
