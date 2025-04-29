import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../interfaces/register-request';
import { ValidationError } from '../../interfaces/validation-errors';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatIconModule,MatSelectModule,RouterLink, ReactiveFormsModule, AsyncPipe, CommonModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  matSnackbar = inject(MatSnackBar);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  roles$!:Observable<Role[]>;
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = inject(Router);
  confirmPasswordHide:boolean = true;
  passwordHide:boolean = true;
  errors!:ValidationError[];

 ngOnInit(): void{
    this.registerForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      fullname:['', Validators.required],
      roles: [''],
      confirmPassword: ['' ,Validators.required]

    },
    {
      validator:this.passwordMatchValidator,
    });
    this.roles$ = this.roleService.getRoles();
 }
 
 register()
 {
    this.authService.register(this.registerForm.value).subscribe({
      next:(response)=>{
        this.matSnackbar.open(response.message,'Close',{
          duration:5000,
          horizontalPosition:'center'
        })
        this.router.navigate(['/'])
      },
      error:(error: HttpErrorResponse)=>{
        if(error!.status == 400){
          this.errors = error!.error;
          this.matSnackbar.open(error.error.message,'Close', {
            duration:5000,
            horizontalPosition:'center',
          });
        }
        
      }
    })
 }

 private passwordMatchValidator(control:AbstractControl):{[key:string]:boolean} | null{
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  
  if(password != confirmPassword)
  {
    return {'passwordMismatch':true};
  }
  return null;
 }
}
