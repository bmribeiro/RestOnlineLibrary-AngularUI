import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../models/views/book/book';
import { BookDetail } from '../../models/bookDetails';

@Component({
  selector: 'app-add-book-dialog',
  templateUrl: './add-book-dialog.component.html',
  styleUrl: './add-book-dialog.component.css',
})
export class AddBookDialogComponent {

  // FormGroup
  bookForm: FormGroup;

  // Book Detail
  bookDetail: BookDetail;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private dialogRef: MatDialogRef<AddBookDialogComponent>
  ) {

    // Initializes bookDetail based on existing data if available
    this.bookDetail = data?.bookDetail || {
      bookDescription: '',
      imageFilename: '',
      imageBase64: ''
    };

    // Reactive Form - Initialization
    this.bookForm = new FormGroup({
      title: new FormControl(data?.title || '', [Validators.required]),
      category: new FormControl(data?.category || '', [Validators.required]),
      copies: new FormControl(data?.copies || 0, [Validators.required, Validators.min(1),]),
      bookDescription: new FormControl(this.bookDetail.bookDescription || '')
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bookForm.valid) {

      // Update Book Description
      this.bookDetail.bookDescription = this.bookForm.get('bookDescription')?.value || '';

      // Form values
      const formValue: Book = this.bookForm.value;

      // Book
      const book: Book = {
        ...formValue,
        id: this.data?.id,
        available: this.data ? this.data.available : true,
        bookDetail: this.bookDetail
      };

      this.dialogRef.close({
        el: book,
      });
    }
  }

  onFileSelected(event: any) {

    // File
    const file: File = event.target.files[0];

    const reader = new FileReader();
    
    reader.onload = () => {
      this.bookDetail.imageBase64 = reader.result as string;
      this.bookDetail.imageFilename = file.name;
    };

    reader.onerror = (error) => {
      console.error('Error: ', error);
    };

    reader.readAsDataURL(event.target.files[0]);
  }
}
