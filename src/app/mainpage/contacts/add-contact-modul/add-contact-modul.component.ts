import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactformComponent } from "../contactform/contactform.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact-modul',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './add-contact-modul.component.html',
  styleUrl: './add-contact-modul.component.scss'
})
export class AddContactModulComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  createContact() { }
}
