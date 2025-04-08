import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu} from '@angular/material/menu';
import { MatMenuItem } from '@angular/material/menu';
import {MatSidenav} from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';

import {ClipboardModule} from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';


import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({  
  selector: 'app-toolbar',
  imports: [MatToolbar, MatButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, CommonModule, ClipboardModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  constructor(private router: Router, public authService: AuthService, private auth: Auth,) {

  }
  navToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout()
      .then(() => {
        console.log('Logged out');
        this.router.navigate(['/']);
      })
      .catch(err => console.error(err));
  }
}
