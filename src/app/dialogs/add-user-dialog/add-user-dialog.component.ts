import { Component, Inject } from '@angular/core';
import { User } from '../../models/views/user/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css',
})
export class AddUserDialogComponent {

  // FormGroup
  userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {

    // Reactive Form - Initialization
    this.userForm = new FormGroup({
      username: new FormControl(data?.username || '', [Validators.required]),
      email: new FormControl(data?.email || '', [Validators.required]),
      profile: new FormControl(data?.role || '', [Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      // Form values
      const formValue: User = this.userForm.value;

      // User
      const user: User = {
        ...formValue,
        id: this.data?.id,
        createdAt: new Date(),
        userStatus: false
      };

      this.dialogRef.close({
        el: user,
      });
    }
  }
}
