import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../models/views/book/book';

@Component({
  selector: 'app-add-book-dialog',
  templateUrl: './add-book-dialog.component.html',
  styleUrl: './add-book-dialog.component.css',
})
export class AddBookDialogComponent {
  // FormGroup
  bookForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private dialogRef: MatDialogRef<AddBookDialogComponent>
  ) {

    // Reactive Form - Initialization
    this.bookForm = new FormGroup({
      title: new FormControl(data?.title || '', [Validators.required]),
      category: new FormControl(data?.category || '', [Validators.required]),
      copies: new FormControl(data?.copies || 0, [Validators.required, Validators.min(1),]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bookForm.valid) {

      // Form values
      const formValue: Book = this.bookForm.value;

      // Book
      const book: Book = {
        ...formValue,
        id: this.data?.id,
        available: this.data ? this.data.available : true
      };

      this.dialogRef.close({
        el: book,
      });
    }
  }
}
