import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
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

/**
 * Component for creating new tasks via modal interface.
 */
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
export class AddtaskModalComponent implements OnInit, OnDestroy {
  @Input() initialStatus: string = 'todo';
  @Input() buttonPosition: {
    right?: string;
    bottom?: string;
    bottomTablet?: string;
    bottomMobile?: string;
  } = {};
  @Input() useFixedPosition: boolean = true;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<string>();

  isDesktop: boolean = true;
  isMobile: boolean = false;

  title: string = '';
  description: string = '';
  date: any;
  category: string = '';
  selectedPrio: string = 'medium';
  newSubtask: string = '';

  categoryDropDownOpen: boolean = false;
  contactDropDownOpen: boolean = false;
  titleTouched: boolean = false;
  dateTouched: boolean = false;
  categoryTouched: boolean = false;

  editingSubtaskIndex: number | null = null;
  editingSubtaskValue: string = '';

  selectedContacts: Contactlist[] = [];
  subtasks: string[] = [];
  minDate: Date = new Date();
  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  @ViewChild('editInput') editInput!: ElementRef;
  isSubtaskActive: boolean = false;

  /**
   * @param contactlist - Service for contact operations
   * @param taskService - Service for task operations
   * @param router - Angular router for navigation
   */
  constructor(
    public contactlist: FirebaseService,
    public taskService: TasksFirbaseService,
    private router: Router
  ) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  /**
   * Initializes component and sets up default values.
   */
  ngOnInit() {
    this.selectPrio('medium');
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  /**
   * Checks current screen size and updates responsive flags.
   * Since modal is only used on screens ≥850px, simplified logic.
   */
  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.isMobile = screenWidth < 768;
    this.isDesktop = screenWidth >= 1024;
    this.useFixedPosition = this.isMobile;
  }

  /**
   * Focuses edit input after view initialization.
   */
  ngAfterViewInit() {
    if (this.editingSubtaskIndex !== null && this.editInput) {
      this.editInput.nativeElement.focus();
      this.editInput.nativeElement.select();
    }
  }

  get allContacts() {
    return this.contactlist.getSortedContacts();
  }

  /**
   * Sets the selected priority level.
   *
   * @param prio - Priority level to set
   */
  selectPrio(prio: string) {
    this.selectedPrio = prio;
  }

  /**
   * Gets color for contact initial letter.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    return this.contactlist.getColorForLetter(letter);
  }

  /**
   * Checks if contact is selected.
   *
   * @param contact - Contact to check
   */
  isSelected(contact: Contactlist) {
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.id === contact.id
    );
  }

  /**
   * Toggles contact selection.
   *
   * @param contact - Contact to toggle
   */
  toggleContact(contact: Contactlist) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.id !== contact.id
      );
    } else {
      this.selectedContacts.push(contact);
    }
  }

  /**
   * Handles category dropdown blur event.
   */
  onCategoryBlur() {
    this.categoryDropDownOpen = false;
    if (!this.category) {
      this.categoryTouched = true;
    }
  }

  /**
   * Validates if date is not in the past.
   *
   * @param date - Date to validate
   */
  validateDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  /**
   * Shows subtask input controls and focuses input.
   */
  showSubtaskControls() {
    this.isSubtaskActive = true;
    setTimeout(() => {
      this.subtaskInput.nativeElement.focus();
    });
  }

  /**
   * Handles subtask input blur event.
   */
  onSubtaskBlur() {
    setTimeout(() => {
      if (!this.newSubtask.trim()) {
        this.isSubtaskActive = false;
      }
    }, 100);
  }

  /**
   * Clears subtask input and hides controls.
   */
  clearSubtaskInput() {
    this.newSubtask = '';
    this.isSubtaskActive = false;
  }

  /**
   * Adds a new subtask to the list.
   */
  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask.trim());
      this.newSubtask = '';
    }
    this.isSubtaskActive = false;
  }

  /**
   * Starts editing a subtask.
   *
   * @param index - Index of subtask to edit
   */
  editSubtask(index: number) {
    this.editingSubtaskIndex = index;
    this.editingSubtaskValue = this.subtasks[index];
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
        this.editInput.nativeElement.select();
      }
    }, 10);
  }

  /**
   * Saves the edited subtask.
   */
  saveEditedSubtask() {
    if (this.editingSubtaskIndex !== null && this.editingSubtaskValue.trim()) {
      this.subtasks[this.editingSubtaskIndex] = this.editingSubtaskValue.trim();
      this.cancelEditSubtask();
    }
  }

  /**
   * Cancels subtask editing.
   */
  cancelEditSubtask() {
    this.editingSubtaskIndex = null;
    this.editingSubtaskValue = '';
  }

  /**
   * Handles keyboard events in subtask editing.
   *
   * @param event - Keyboard event
   */
  onSubtaskKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.saveEditedSubtask();
    } else if (event.key === 'Escape') {
      this.cancelEditSubtask();
    }
  }

  /**
   * Removes a subtask from the list.
   *
   * @param index - Index of subtask to remove
   */
  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  /**
   * Creates task data object for database storage.
   */
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

  /**
   * Formats selected contacts as string array.
   */
  getFormattedContacts(): string[] {
    return this.selectedContacts.map(
      (contact) => `${contact.firstName} ${contact.lastName}`
    );
  }

  /**
   * Formats date value as Date object.
   */
  getFormattedDate(): Date {
    return this.date instanceof Date ? this.date : new Date(this.date);
  }

  /**
   * Formats subtasks with done status.
   */
  getFormattedSubtasks(): { title: string; done: boolean }[] {
    return this.subtasks.map((title) => ({
      title,
      done: false,
    }));
  }

  /**
   * Adds task to database via template click.
   *
   * @throws {Error} When task creation fails
   */
  async addTaskToDBViaTemplateClick() {
    try {
      const taskData = this.createTaskData();
      await this.saveTaskAndRedirect(taskData);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Tasks:', error);
      this.showSuccessMessageBox('Fehler beim Hinzufügen des Tasks!');
    }
  }

  /**
   * Adds task to database.
   *
   * @param formData - Task data to save
   *
   * @throws {Error} When task creation fails
   */
  async addTaskToDB(formData: TasksFirestoreData) {
    try {
      await this.taskService.addTask(formData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Saves task and redirects to board.
   *
   * @param taskData - Task data to save
   *
   * @throws {Error} When task creation fails
   */
  async saveTaskAndRedirect(taskData: TasksFirestoreData): Promise<void> {
    await this.addTaskToDB(taskData);
    this.successMessage.emit('Task added to board');
    this.clearForm();
    this.taskCreated.emit();
    await this.navigateToBoard();
  }

  /**
   * Navigates to board page with delay.
   *
   * @throws {Error} When navigation fails
   */
  async navigateToBoard(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await this.router.navigate(['/board']);
  }

  /**
   * Shows success message to user.
   *
   * @param message - Success message to display
   */
  showSuccessMessageBox(message: string) {
    // entfernt: successMessageContent und showSuccessMessage
  }

  /**
   * Clears all form fields and resets state.
   */
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

  get displayedContacts() {
    return this.selectedContacts.slice(0, 3);
  }

  get remainingCount() {
    return this.selectedContacts.length - 3;
  }

  get hasExtraContacts() {
    return this.selectedContacts.length > 3;
  }

  get buttonStyles() {
    return {
      '--button-right': this.buttonPosition.right || '5%',
      '--button-bottom': this.buttonPosition.bottom || '10%',
      '--button-bottom-tablet': this.buttonPosition.bottomTablet || '15%',
      '--button-bottom-mobile': this.buttonPosition.bottomMobile || '13%',
    };
  }

  /**
   * Cleans up event listeners on component destroy.
   */
  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
}
