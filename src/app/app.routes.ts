import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';

import { AuthGuard } from './guards/auth.guard';
import { RedirectAuthGuard } from './guards/redirect-auth.guard';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/auth/login/login.component';
import { NotFoundComponent } from './components/core/error/not-found/not-found.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';



export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectAuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks/:id',
    component: ProjectPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pedit/:id',
    component: ProjectEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tedit/:tid/:pid',
    component: TaskEditComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component:  NotFoundComponent}
];
