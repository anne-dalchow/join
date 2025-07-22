import { RouterModule, Routes } from '@angular/router';
import { LegalnoticeComponent } from './pages/legalnotice/legalnotice.component';
import { PrivacypoliceComponent } from './pages/privacypolice/privacypolice.component';
import { ContactsComponent } from './mainpage/contacts/contacts.component';
import { HelpComponent } from './pages/help/help.component';
import { AddTaskComponent } from './mainpage/add-task/add-task.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'summary', component: MainpageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
  {
    path: 'board',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./mainpage/board/board.component').then((m) => m.BoardComponent),
  },
  { path: 'add-task', component: AddTaskComponent, canActivate: [AuthGuard] },
  { path: 'legalnotice', component: LegalnoticeComponent },
  { path: 'privacypolicy', component: PrivacypoliceComponent },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
];

NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
});
export class AppRoutingModule {}
