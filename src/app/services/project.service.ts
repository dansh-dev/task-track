import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, setDoc, getDoc, collectionData, arrayUnion, docData } from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Auth } from '@angular/fire/auth';
import { map, Observable, combineLatest } from 'rxjs';
import { collectionSnapshots, docSnapshots } from '@angular/fire/firestore/lite';
import { query, orderBy, where } from '@angular/fire/firestore';


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


  async deleteProject(projectId: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}`);
    await deleteDoc(ref);
  }


  async shareProject(projectId: string, userIdToShareWith: string): Promise<void> {
    const ref = doc(this.firestore, `projects/${projectId}`);
    await updateDoc(ref, {
      sharedWith: arrayUnion(userIdToShareWith),
    });
  }

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

  getAccessibleProjects(): Observable<Project[]> {
    const uid = this.userId();
  
    // Reference to the projects collection
    const projectsRef = collection(this.firestore, 'projects');
  
    // Query to fetch projects owned by the user
    const ownedProjectsQuery = query(projectsRef, where('ownerId', '==', uid));
  
    // Query to fetch projects shared with the user
    const sharedProjectsQuery = query(projectsRef, where('sharedWith', 'array-contains', uid));
  
    // Combine the results of both queries
    const ownedProjects$ = collectionData(ownedProjectsQuery, { idField: 'id' }) as Observable<Project[]>;
    const sharedProjects$ = collectionData(sharedProjectsQuery, { idField: 'id' }) as Observable<Project[]>;
  
    // Merge the two observables and remove duplicates
    return combineLatest([ownedProjects$, sharedProjects$]).pipe(
      map(([ownedProjects, sharedProjects]) => {
        const allProjects = [...ownedProjects, ...sharedProjects];
        // Remove duplicates by project ID
        const uniqueProjects = allProjects.filter(
          (project, index, self) => self.findIndex(p => p.id === project.id) === index
        );
        return uniqueProjects;
      })
    );
  }

getTasks(projectId: string): Observable<Task[]> {
  const taskCollection = collection(this.firestore, `projects/${projectId}/tasks`);
  const tasksQuery = query(taskCollection, orderBy('dueDate', 'asc')); // Order tasks by dueDate descending
  return collectionData(tasksQuery, { idField: 'id' }) as Observable<Task[]>;
}
}

