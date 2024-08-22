import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './pages/books/books.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from './pages/common/header/header.component';
import { FooterComponent } from './pages/common/footer/footer.component';
import { AddBookDialogComponent } from './dialogs/add-book-dialog/add-book-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationComponent } from './shared/notification/notification.component';
import { MatIconModule } from '@angular/material/icon';
import { DetailComponent } from './pages/detail/detail.component';
import { DetailViewComponent } from './views/detail-view/detail-view.component';
import { MatButtonModule } from '@angular/material/button';
import { FormComponent } from './pages/authentication/form/form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BookDialogComponent } from './dialogs/book-dialog/book-dialog.component';
import { AuthUsersComponent } from './pages/auth-users/auth-users.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    HomeComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AddBookDialogComponent,
    AddUserDialogComponent,
    NotificationComponent,
    DetailComponent,
    DetailViewComponent,
    FormComponent,
    BookDialogComponent,
    AuthUsersComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatIconModule,
    MatButtonModule,
    MatTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
