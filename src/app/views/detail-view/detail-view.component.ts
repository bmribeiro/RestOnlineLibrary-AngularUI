import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent {

  @Input() data!: any;
  @Input() type!: 'user' | 'book';

}
