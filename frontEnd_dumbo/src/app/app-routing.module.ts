import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenGuard } from './token-guard.guard';
import { DashboardAddComponent } from './components/dashboard-add/dashboard-add.component';
import { DashboardUpdateComponent } from './components/dashboard-update/dashboard-update.component';


const routes: Routes = [
  { path: "", component: LoginComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent, canActivate: [TokenGuard] },
  { path: "dashboard/add", component: DashboardAddComponent, canActivate: [TokenGuard] },
  { path: "dashboard/edit/:id", component: DashboardUpdateComponent, canActivate: [TokenGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
