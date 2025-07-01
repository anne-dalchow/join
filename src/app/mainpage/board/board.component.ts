import { Component, Input } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CompactTaskComponent } from '../../shared/compact-task/compact-task.component';
import { TasksFirbaseService } from '../../shared/services/tasks-firbase.service';
import { Tasks } from '../../../interfaces/tasks';
import { doc, updateDoc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CompactTaskComponent,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    FormsModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(public taskService: TasksFirbaseService) {}
  @Input() selcetedTask: Tasks | null = null;

  searchText: string = '';

  filteredTasks: Tasks[] = [];

  ngOnInit(): void {
    this.filteredTasks = this.taskService.tasks;

    this.taskService.onTaskChanged = (tasks: Tasks[]) => {
      this.filteredTasks = tasks;
      this.searchTask();
    };
  }

  get todoTasks() {
    return this.filteredTasks.filter((task) => task.status === 'todo');
  }
  get inProgressTasks() {
    return this.filteredTasks.filter((task) => task.status === 'inprogress');
  }
  get awaitFeedbackTasks() {
    return this.filteredTasks.filter((task) => task.status === 'awaitfeedback');
  }
  get doneTasks() {
    return this.filteredTasks.filter((task) => task.status === 'done');
  }

  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      const newStatus = this.getStatusByArray(event);
      if (movedTask && newStatus) {
        movedTask.status = newStatus;
        if (typeof movedTask.id === 'string') {
          this.taskService.updateTaskStatus(movedTask.id, {
            status: newStatus,
          });
        }
      }
    }
  }

  private getStatusByArray(event: CdkDragDrop<Tasks[]>) {
    const id = event.container.id as string;
    if (id.includes('todo')) return 'todo';
    if (id.includes('inprogress')) return 'inprogress';
    if (id.includes('awaitfeedback')) return 'awaitfeedback';
    if (id.includes('done')) return 'done';
    return '';
  }

  searchKey(data: string) {
    this.searchText = data;
    this.searchTask();
  }

  searchTask() {
    const search = this.searchText.toLowerCase();
    if (!search) {
      this.filteredTasks = this.taskService.tasks;
    }
    this.filteredTasks = this.taskService.tasks.filter(
      (element) =>
        element.title?.toLowerCase().includes(search) ||
        element.description?.toLowerCase().includes(search)
    );
  }
}
