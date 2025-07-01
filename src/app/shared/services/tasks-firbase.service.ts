import { inject, Injectable } from '@angular/core';
import {collection, doc, Firestore, onSnapshot, Timestamp, updateDoc,} from '@angular/fire/firestore';
import { Subtask, Tasks, TasksFirestoreData } from '../../../interfaces/tasks';

@Injectable({
  providedIn: 'root',
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  subtasks: Subtask[] = [];
  unsubscribe;

  constructor() {
    this.unsubscribe = this.subTasks();
  }

  async updateTaskStatus(id: string, data: object) {
    const docRef = doc(this.firestore, `tasks/${id}`);
    await updateDoc(docRef, data);
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
      });
    });
  }

  setTasksObject(obj: TasksFirestoreData, id: string): Tasks {
    const subtask = Array.isArray(obj.subtasks) ? obj.subtasks.map(title => typeof title === 'string' ? { title, done: false } : title) : [];
    return {
      id: id,
      assignedTo: obj.assignedTo || [],
      category: obj.category || '',
      date: obj.date || Timestamp.now(),
      description: obj.description || '',
      priority: obj.priority || '',
      status: obj.status || '',
      subtasks: subtask,
      title: obj.title || '',
    };
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
