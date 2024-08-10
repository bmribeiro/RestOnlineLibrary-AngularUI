import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserActiveService } from '../../../services/user-active.service';
import { AuthorizationService } from '../../../services/authorization-service';
import { LoginFormData } from '../../../models/auth/login-form-data';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { RegisterFormData } from '../../../models/auth/register-form-data';

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
    private authorizationService: AuthorizationService,
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
      username: ['', [Validators.required]],
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

      this.authorizationService.request('post', '/login', { 

          email: loginFormData.email,
          password: loginFormData.password
      })
      .subscribe(
        (response) => {

          this.authorizationService.setAuthToken(response.token);
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
      this.authorizationService
        .request('post', '/register', {

          username: registerFormData.username,
          email: registerFormData.email,
          password: registerFormData.password
        })
        .subscribe(
          (response) => {
            
            this.authorizationService.setAuthToken(response.token);
            this.userActiveService.setSelectedUser(response);

            // Redirect to: Home
            this.router.navigate(['/home']);
            this.notificationService.sendMessage('Successfully Deleted Book');
          },
          (error) => {
            this.authorizationService.setAuthToken(null);
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
