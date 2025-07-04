import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { Subtask, Tasks } from '../../../interfaces/tasks';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {

  constructor(private taskService: TasksFirbaseService) { }

  @Input() task!: Tasks;
  @Output() taskClick = new EventEmitter<Tasks>();

  onTaskClick(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.taskClick.emit(this.task);
  }

  @Input() subtask!: Subtask[];
  selectedSubtask: Subtask | null = null;

  getList() {
    return this.taskService.tasks
  }

  getSubtasksDone(): number {
    return this.task?.subtasks?.filter((sub) => sub.done).length ?? 0;
  }

  getSubtaskLength(): number {
    return this.task?.subtasks?.length ?? 0;
  }

  getShortDescription(desc: string | undefined, max: number = 40): string {
    if (!desc) return '';
      return desc.length > max ? desc.slice(0, max) + '...' : desc;
    }
  
  getPriorityIcon(): string {
    switch (this.task?.priority?.toLowerCase()) {
      case 'urgent':
        return '/assets/images/board/prio-urgent.svg';
      case 'medium':
        return '/assets/images/board/prio-medium.svg';
      case 'low':
        return '/assets/images/board/prio-low.svg';
      default:
        return '/assets/images/board/prio-medium.svg';
    }
  }

}
