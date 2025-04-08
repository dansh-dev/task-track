import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private firestore: Firestore) {}

  async addTask(projectId: string, task: Omit<Task, 'creationDate'>): Promise<void> {
    const newTask: Task = {
      ...task,
      creationDate: new Date(),
    };

    const taskCollection = collection(this.firestore, `projects/${projectId}/tasks`);
    await addDoc(taskCollection, newTask);
  }

  async updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}/tasks/${taskId}`);
    await updateDoc(ref, updates);
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(ref);
  }
}
