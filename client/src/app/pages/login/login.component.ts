import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'
@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  authService=inject(AuthService);
  matSnackbar=inject(MatSnackBar);
  router=inject(Router);
  hide = true;
  form!: FormGroup;
  fb = inject(FormBuilder);

  login() 
  {
    this.authService.login(this.form.value).subscribe({
      next:(response)=>{
        this.matSnackbar.open(response.message,'Close',{
          duration:5000,
          horizontalPosition:'center'
        })
        this.router.navigate(['/'])
      },
      error:(error)=>{
        this.matSnackbar.open(error.error.message,'Close', {
            duration:5000,
            horizontalPosition:'center',
          });
      }
    });
  }

  ngOnInit(): void {
      this.form = this.fb.group(
        {
          email:['',[Validators.required, Validators.email]],
          password:['',[Validators.required]]
        }
      );
  }


}
