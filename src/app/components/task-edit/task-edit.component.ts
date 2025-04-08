import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { filter, Observable } from 'rxjs';

import { ProjectService } from '../../services/project.service';

import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCard } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';

import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  imports: [
    CommonModule,
    MatButton,
    FormsModule,
    MatButtonToggleModule
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css',
})
export class TaskEditComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  projects$!: Observable<Project>; // Observable to get a project
  selectedProject: Project | null = null; // Store the selected project for viewing/editing tasks
  editedTask: Task = {
    // For creating a new project
    description: '',
    title: '',
    completed: false,
    creationDate: new Date(),
    dueDate: new Date(),
    priority: 'Low',
    tags: [],
    ownerId: '',
  };
  sharedUsers: string = '';
  tags: string = ''; // String to hold tags input

  constructor(
    private projectService: ProjectService,
    public router: Router,
    public authService: AuthService,
    private auth: Auth
  ) {}

  taskID = this.activatedRoute.snapshot.params['tid'];
  projectID = this.activatedRoute.snapshot.params['pid'];

  ngOnInit() {
    // Retrieve the project
    this.projects$ = this.projectService
      .getProjectById(this.projectID)
      .pipe(filter((project): project is Project => project != null));

    // Retrieve the specific task
    this.projectService.getTasks(this.projectID).subscribe((tasks: Task[]) => {
      const task = tasks.find((t) => t.id === this.taskID);
      if (task) {
        this.editedTask = task; // Populate the editedTask object with the retrieved task
        console.log(task);
        this.tags = task.tags.join(', '); // Convert tags array to a comma-separated string
      } else {
        console.error('Task not found');
      }
    });
  }

  updateTask() {
    this.editedTask.tags = this.tags.split(',').map((tag) => tag.trim()); // Split tags by comma and trim whitespace
    this.editedTask.ownerId = this.auth.currentUser?.uid!;

    this.projectService
      .updateTask(this.projectID, this.taskID, this.editedTask)
      .then(() => {
        this.router.navigate(['/tasks', this.projectID]); // Redirect to the project page
      });
  }
  taskComplete() {
    this.editedTask.completed = !this.editedTask.completed; // Toggle the completed status
  }
}
