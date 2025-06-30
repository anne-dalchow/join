import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { Subtasks, Tasks } from '../../../interfaces/tasks';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {
input: any;

  constructor(private taskService: TasksFirbaseService) { }

  @Input() task!: Tasks;
  @Input() subtask!: Subtasks;

  getTaskList() {
    return this.taskService.tasks;
  }

  getSubtaskList() {
    return this.taskService.subtasks;
  }

  changeDone(){
   
  }
}
