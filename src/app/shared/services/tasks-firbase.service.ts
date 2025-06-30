import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, Timestamp } from '@angular/fire/firestore';
import { Subtasks, Tasks, TasksFirestoreData } from '../../../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  subtasks: Subtasks [] = [];
  unsubscribe;


  constructor() {
    this.unsubscribe = this.subTasks();
  }

  getTasks() {
    return collection(this.firestore, 'tasks');
  }

  subTasks() {
    return onSnapshot(this.getTasks(), (list) => {
      this.tasks = [];
      this.subtasks = [];
      list.forEach((element) => {
        const task = this.setTasksObject(element.data(), element.id);
        this.tasks.push(task);
        if (task.subtasks && Array.isArray(task.subtasks)) {
          task.subtasks.forEach(sub => {
            const titleRef = sub || '';
            this.subtasks.push({ title: titleRef, done: false});
          })
          
            
            console.log(this.subtasks.length);
             
            
        }
      });

    });
  }

  setTasksObject(obj: TasksFirestoreData, id: string): Tasks {
    return {
      id: id,
      assignedTo: obj.assignedTo || [],
      category: obj.category || '',
      date: obj.date || Timestamp.now(),
      description: obj.description || '',
      priority: obj.priority || '',
      status: obj.status || '',
      subtasks: obj.subtasks || [],
      title: obj.title || '',
    };
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
