import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';


import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardSubtitle } from '@angular/material/card';
import { MatCardTitleGroup } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { MatCardActions } from '@angular/material/card';

import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgIf, CommonModule, MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatCardSubtitle, MatButton, MatCardTitleGroup, MatChipsModule, MatCardActions],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(@Inject(AuthService) public authService: AuthService, private auth: Auth, private router: Router) {}

  Sign() {
    this.router.navigate(['/login']);
  }
}

