import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../services/auth.service';

import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-task-list',
  imports: [MatCardModule, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})



export class TaskListComponent {
  constructor(private router: Router, public authService: AuthService, private auth: Auth) { 
  }


}
