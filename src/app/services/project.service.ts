import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, setDoc, getDoc, collectionData, arrayUnion, docData } from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { collectionSnapshots, docSnapshots } from '@angular/fire/firestore/lite';
import { query, orderBy } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private userId(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    return uid;
  }

  async createProject(project: Omit<Project, 'ownerId' | 'creationDate' | 'sharedWith'>): Promise<void> {
    const newProject: Project = {
      ...project,
      creationDate: new Date(),
      ownerId: this.userId(),
      sharedWith: [],
    };

    await addDoc(collection(this.firestore, 'projects'), newProject);
  }

  getProjectById(projectId: string): Observable<Project | undefined> {
    return docData(doc(this.firestore, `projects/${projectId}`)) as Observable<Project | undefined>;
  }
  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}`);
    await updateDoc(ref, updates);
  }

  // 🔹 Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}`);
    await deleteDoc(ref);
  }

  // 🔹 Share a project with another user
  async shareProject(projectId: string, userIdToShareWith: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}`);
    await updateDoc(ref, {
      sharedWith: arrayUnion(userIdToShareWith),
    });
  }

  // 🔹 Add a task to a project
  async addTask(projectId: string, task: Omit<Task, 'creationDate'>): Promise<void> {
    const newTask: Task = {
      ...task,
      creationDate: new Date(),
    };

    const taskCollection = collection(this.firestore, `projects/${projectId}/tasks`);
    await addDoc(taskCollection, newTask);
  }

  // 🔹 Update a task
  async updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}/tasks/${taskId}`);
    await updateDoc(ref, updates);
  }

  // 🔹 Delete a task
  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(ref);
  }

  // 🔹 Get all projects the user owns or is shared with
  getAccessibleProjects(): Observable<Project[]> {
    const uid = this.userId();

    const projectsRef = collection(this.firestore, 'projects');
    return collectionData(projectsRef, { idField: 'id' }) as Observable<Project[]>;
    // You can add filtering in your component or expand this method with filtering logic
  }

getTasks(projectId: string): Observable<Task[]> {
  const taskCollection = collection(this.firestore, `projects/${projectId}/tasks`);
  const tasksQuery = query(taskCollection, orderBy('dueDate', 'asc')); // Order tasks by dueDate descending
  return collectionData(tasksQuery, { idField: 'id' }) as Observable<Task[]>;
}
}
