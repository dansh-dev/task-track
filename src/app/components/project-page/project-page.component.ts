import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

import { Router } from '@angular/router';

@Component({
  selector: 'app-project-page',
  imports: [
    CommonModule,
    MatIcon,
    FormsModule,
    MatButton,
    MatCardActions,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
  ],

  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css',
})
export class ProjectPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  tags = ''; // String to hold tags input
  newTask: Omit<Task, 'creationDate'> = {
    title: '',
    completed: false,
    priority: 'Low',
    dueDate: new Date(),
    description: '',
    tags: ['new'],
    ownerId: '',
  };
  isProjectSelected = false; // Flag to show/hide the project selection
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    public router: Router,
    public authService: AuthService,
    private auth: Auth
  ) {}
  projectID = this.activatedRoute.snapshot.params['id'];

  projects$!: Observable<Project>; // Observable to get a project
  tasks$!: Observable<Task[]>; // Observable to get tasks for a project
  isCreatingTask = false; // Flag to show/hide the task creation form
  ngOnInit() {
    this.tasks$ = this.projectService.getTasks(this.projectID);
    this.projects$ = this.projectService
      .getProjectById(this.projectID)
      .pipe(filter((project): project is Project => !!project));

    this.tasks$.subscribe((tasks) => {});

    if (this.projectID.length < 5) {
      this.isProjectSelected = false; // No project selected
      this.router.navigate(['/']); // Redirect to projects page
      return;
    } else {
      this.isProjectSelected = true; // Project selected
    }
  }

  editProject(projectID: string) {
    this.router.navigate(['/pedit', projectID]); // Navigate to the project edit page
  }

  addingTask() {
    this.isCreatingTask = !this.isCreatingTask; // Toggle the task creation form
  }

  addTask(): void {
    if (!this.newTask.title || !this.newTask.dueDate) {
      alert('Task title and due date are required');
      return;
    }
    if (!this.projectID) {
      alert('No project selected');
      return;
    }
    if (this.newTask.dueDate < new Date()) {
      alert('Due date must be in the future');
      return;
    }
    if (this.newTask.title.length < 3) {
      alert('Task title must be at least 3 characters long');
      return;
    }
    this.newTask.tags = this.tags.split(',').map((tag) => tag.trim()); // Split tags by comma and trim whitespace
    this.newTask.ownerId = this.auth.currentUser?.uid!;
    this.taskService
      .addTask(this.projectID, {
        ...this.newTask,
        dueDate: this.newTask.dueDate,
      })
      .then(() => {});
    this.tasks$ = this.projectService.getTasks(this.projectID); // Refresh the task list

    this.addingTask();
  }
  editTask(task: Task) {
    this.router.navigate(['/tedit', task.id, this.projectID]);
  }
  deleteTask(taskId: string): void {
    this.projectService.deleteTask(this.projectID, taskId).then(() => {});
  }
}
