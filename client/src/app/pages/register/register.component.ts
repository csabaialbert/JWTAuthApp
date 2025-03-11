import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatIconModule,MatSelectModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
 form!: FormGroup;
 router = inject(Router);
 confirmPasswordHide:boolean = true;
passwordHide:boolean = true;
 ngOnInit(): void{
    this.form = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      fullname:['', Validators.required],
      roles: [''],
      confirmPassword: ['' ,Validators.required]

    })
 }
}
