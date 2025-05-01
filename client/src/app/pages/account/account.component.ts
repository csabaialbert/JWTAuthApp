import { Component, inject, ChangeDetectionStrategy, model, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationError } from '../../interfaces/validation-errors';
import { PasswordChangeRequest } from '../../interfaces/password-change-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface DialogData{
  oldPassword:string;
  newPassword:string;
  confirmPassword:string;
}

@Component({
  selector: 'app-account',
  imports: [CommonModule,MatIconModule, MatButtonModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService);
  accountDetail$ = this.authService.getDetail();
  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly dialog = inject(MatDialog);
  openChangePasswordDialog(): void{
    const dialogRef = this.dialog.open(ChangePasswordDialog, 
      { data: {oldPassword: this.oldPassword(), newPassword: this.newPassword(), confirmPassword: this.confirmPassword()},});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
@Component({
  selector:'change-password-dialog',
  templateUrl: '../dialogs/change-password-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class ChangePasswordDialog {
  readonly dialogRef = inject(MatDialogRef<ChangePasswordDialog>);
  readonly data = inject<AccountComponent>(MAT_DIALOG_DATA);
  readonly oldPassword = model(this.data.oldPassword);
  readonly newPassword = model(this.data.newPassword);
  readonly confirmPassword = model(this.data.confirmPassword);
  readonly fb = inject(FormBuilder);
  changePasswordForm!:FormGroup;
  oldPasswordHide:boolean = true;
  newPasswordHide:boolean = true;
  confirmPasswordHide:boolean = true;
  errors!:ValidationError[];
  authService = inject(AuthService);
  accountDetail$ = this.authService.getDetail();
  accountMail:string = '';
  accountName:string = '';
  matSnackbar = inject(MatSnackBar);

  ngOnInit():void{
    this.changePasswordForm = this.fb.group({
      oldPassword:['', [Validators.required]],
      newPassword:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]
    },
    {
      validator:this.passwordMatchValidator,
    });
    this.accountDetail$.subscribe({next: value => {this.accountMail = value.email; this.accountName = value.fullName}});
  }
  private passwordMatchValidator(control:AbstractControl):{[key:string]:boolean} | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if(newPassword != confirmPassword)
    {
      return {'passwordMismatch':true};
    }
    return null;
  }


  cancel(): void 
  {
    this.dialogRef.close();
  }
  changePassword(control:AbstractControl)
  {
    const passwordChangeReq: PasswordChangeRequest = {
      email:this.accountMail,
      currentPassword: control.get('oldPassword')?.value,
      newPassword: control.get('newPassword')?.value
    }
    this.authService.changePassword(passwordChangeReq).subscribe({next: (response)=> {
      this.matSnackbar.open('Password changed successfully', 'Close', {
          duration:5000,
          horizontalPosition:'center'
        });
        console.log('PAssword changed');
        this.dialogRef.close();
      },
      error:(error:HttpErrorResponse)=>{
        if(error!.status == 400){
          this.matSnackbar.open(error.error.message, 'Close', {
            duration:5000,
            horizontalPosition:'center'
          });
        }
      }
  })
  }
}
