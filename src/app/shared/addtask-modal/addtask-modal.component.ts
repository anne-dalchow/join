import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { Router } from '@angular/router';
import { Contactlist } from '../../../interfaces/contactlist';
import { TasksFirestoreData } from '../../../interfaces/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-addtask-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './addtask-modal.component.html',
  styleUrl: './addtask-modal.component.scss',
})
export class AddtaskModalComponent implements OnInit {
  @Input() initialStatus: string = 'todo';
  @Output() taskCreated = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<string>(); // Neuer Event Emitter

  constructor(
    public contactlist: FirebaseService,
    public taskService: TasksFirbaseService,
    private router: Router
  ) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  title: string = '';
  description: string = '';
  date: any;
  category: string = '';
  selectedPrio: string = 'medium';
  contactInput: string = '';
  newSubtask: string = '';
  successMessageContent = '';

  showSuccessMessage = false;
  categoryDropDownOpen = false;
  contactDropDownOpen = false;
  titleTouched = false;
  dateTouched = false;
  categoryTouched = false;

  selectedContacts: Contactlist[] = [];
  filteredContacts: Contactlist[] = [];
  subtasks: string[] = [];
  minDate: Date = new Date();
  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  isSubtaskActive: boolean = false;

  ngOnInit() {
    this.filteredContacts = this.allContacts;
    this.selectPrio('medium');
  }

  get allContacts() {
    return this.contactlist.getSortedContacts();
  }

  selectPrio(prio: string) {
    this.selectedPrio = prio;
  }

  getColorForLetter(letter: string): string {
    return this.contactlist.getColorForLetter(letter);
  }

  isSelected(contact: Contactlist) {
    // .some() gibt true zurück, wenn die Bedingung für mindestens ein Element zutrifft, sonst false
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.id === contact.id
    );
  }

  toggleContact(contact: Contactlist) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.id !== contact.id
      );
    } else {
      this.selectedContacts.push(contact);
    }
  }

  onCategoryBlur() {
    this.categoryDropDownOpen = false;
    if (!this.category) {
      this.categoryTouched = true;
    }
  }

  validateDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  showSubtaskControls() {
    this.isSubtaskActive = true;
    setTimeout(() => {
      this.subtaskInput.nativeElement.focus();
    });
  }

  onSubtaskBlur() {
    setTimeout(() => {
      if (!this.newSubtask.trim()) {
        this.isSubtaskActive = false;
      }
    }, 100);
  }

  clearSubtaskInput() {
    this.newSubtask = '';
    this.isSubtaskActive = false;
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask.trim());
      this.newSubtask = '';
    }
    this.isSubtaskActive = false;
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  createTaskData(): TasksFirestoreData {
    const taskData = {
      title: this.title,
      description: this.description,
      category: this.category,
      assignedTo: this.getFormattedContacts(),
      date: this.getFormattedDate(),
      priority: this.selectedPrio || 'medium',
      subtasks: this.getFormattedSubtasks(),
      status: this.initialStatus,
    };
    return taskData;
  }

  getFormattedContacts(): string[] {
    return this.selectedContacts.map(
      (contact) => `${contact.firstName} ${contact.lastName}`
    );
  }

  getFormattedDate(): Date {
    return this.date instanceof Date ? this.date : new Date(this.date);
  }

  getFormattedSubtasks(): { title: string; done: boolean }[] {
    return this.subtasks.map((title) => ({
      title,
      done: false,
    }));
  }

  async addTaskToDBViaTemplateClick(): Promise<void> {
    try {
      const taskData = this.createTaskData();
      await this.saveTaskAndRedirect(taskData);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Tasks:', error);
      this.showSuccessMessageBox('Fehler beim Hinzufügen des Tasks!');
    }
  }

  async addTaskToDB(formData: TasksFirestoreData) {
    try {
      await this.taskService.addTask(formData);
    } catch (error) {
      throw error;
    }
  }

  async saveTaskAndRedirect(taskData: TasksFirestoreData): Promise<void> {
    await this.addTaskToDB(taskData);
    // Entfernen Sie die showSuccessMessageBox hier
    // this.showSuccessMessageBox('Task wurde erfolgreich hinzugefügt!');

    // Emit success message to parent
    this.successMessage.emit('Task added to board');

    this.clearForm();
    this.taskCreated.emit();
    await this.navigateToBoard();
  }

  async navigateToBoard(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await this.router.navigate(['/board']);
  }

  showSuccessMessageBox(message: string) {
    this.successMessageContent = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 1500);
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.date = null;
    this.selectedPrio = 'medium';
    this.category = '';
    this.selectedContacts = [];
    this.subtasks = [];
    this.categoryDropDownOpen = false;
    this.contactDropDownOpen = false;
    this.titleTouched = false;
    this.dateTouched = false;
    this.categoryTouched = false;
  }
}
