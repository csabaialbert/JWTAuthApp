import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,RouterLink,MatMenuModule,CommonModule, MatSnackBarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService=inject(AuthService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);

  isLoggedIn()
  {
    return this.authService.isLoggedIn();
  }

  logout=()=>{
    this.authService.logout();
    this.matSnackBar.open('Logged out successfully!','Close',{
      duration:5000,
      horizontalPosition:'center'
    });
    this.router.navigate(['/login']);
  }
}
