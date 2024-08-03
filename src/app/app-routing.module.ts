import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BooksComponent } from './pages/books/books.component';
import { UsersComponent } from './pages/users/users.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailComponent } from './pages/detail/detail.component';
import { FormComponent } from './pages/authentication/form/form.component';
import { AuthUsersComponent } from './pages/auth-users/auth-users.component';

const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'books', title: 'Books', component: BooksComponent },
  { path: 'users', title: 'Users', component: UsersComponent },
  { path: 'authusers', title: 'AuthUsers', component: AuthUsersComponent },
  { path: 'detail/:type/:id', title: 'Details', component: DetailComponent },
  { path: 'authentication', title: 'Auth', component: FormComponent },
  
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
