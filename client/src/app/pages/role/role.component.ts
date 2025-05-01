import { Component, inject } from '@angular/core';
import { RoleFormComponent } from "../../components/role-form/role-form.component";
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { RoleService } from '../../services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  imports: [RoleFormComponent,MatFormFieldModule,MatSelectModule,MatInputModule,RoleListComponent, AsyncPipe],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  errorMessage='';
  roles$=this.roleService.getRoles();
  role:RoleCreateRequest = {} as RoleCreateRequest;
  snackbar = inject(MatSnackBar);
  selectedUser:string='';
  users$= this.authService.getAll();
  selectedRole:string='';

  createRole(role:RoleCreateRequest)
  {
    this.roleService.createRole(role).subscribe({
      next:(response:{message:string})=>{
        this.snackbar.open('Role Created successfully!', 'Ok', {
          duration:3000,
          horizontalPosition:'center'
        })
      },
      error: (error: HttpErrorResponse) => {
        if(error.status == 400)
        {
          this.errorMessage = error.error;
        }
      }
    })
  }

  deleteRole(id:string){
    this.roleService.deleteRole(id).subscribe({
      next:(response) => {
        this.roles$ = this.roleService.getRoles();
        this.snackbar.open('Role deleted successfully!', 'Close', {
          duration:3000,
          horizontalPosition:'center'
        });       
      },
      error: (error: HttpErrorResponse) => {
        this.snackbar.open(error.message, 'Close', {
          duration:3000,
          horizontalPosition: 'center'
        });
      },
    });
  }

  assignRole(userId:string, roleId:string)
  {
    this.roleService.assignRole(userId, roleId).subscribe({
      next:(response)=>{
        this.snackbar.open('Role assigned successfully!', 'Close', {
          duration:3000,
          horizontalPosition:'center'
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackbar.open(error.message, 'Close', {
          duration:3000,
          horizontalPosition:'center'
        })
      }
      
    });
  }
}
