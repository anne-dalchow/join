import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { Subtask, Tasks } from '../../../interfaces/tasks';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss',
})
export class CompactTaskComponent {
  @Input() task!: Tasks;
  @Input() subtasks!: Subtask[];
  selectedSubtask: Subtask | null = null;
  constructor(private taskService: TasksFirbaseService) {}

  getList() {
    return this.taskService.tasks;
  }

  getSubtasksDone(): number {
    return this.task?.subtasks?.filter((sub) => sub.done).length ?? 0;
  }

  getSubtaskLength(): number {
    return this.task?.subtasks?.length ?? 0;
  }

}
