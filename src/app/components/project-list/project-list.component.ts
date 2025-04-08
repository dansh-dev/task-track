import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';

import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,
    MatIcon,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<Project[]>; // Observable to get list of projects
  tasks$!: Observable<Task[]>; // Observable to get tasks for a project
  selectedProject: Project | null = null; // Store the selected project for viewing/editing tasks
  newProject: Project = {
    // For creating a new project
    name: '',
    description: '',
    creationDate: new Date(),
    ownerId: '',
    sharedWith: [],
  };

  isCreatingProject = false; // Flag to show/hide the project creation form
  isProjectSelected = false; // Flag to show/hide the project selection

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projects$ = this.projectService.getAccessibleProjects();
    this.tasks$ = this.projectService.getTasks(this.selectedProject?.id!); // Initialize tasks observable
  }

  openProjectMenu() {
    this.isCreatingProject = !this.isCreatingProject; // Toggle the project creation form
  }
  // 🔹 Create a new project
  createProject() {
    if (!this.newProject.name) {
      alert('Project name is required');
      return; // Optionally, show an error message if the name is empty
    }
    this.projectService.createProject(this.newProject).then(() => {
      this.newProject = {
        name: '',
        description: '',
        creationDate: new Date(),
        ownerId: '',
        sharedWith: [],
      };
    });
    this.openProjectMenu();
  }

  // 🔹 Select a project to view/edit tasks
  selectProject(project: Project) {
    if (this.isProjectSelected == false) {
      this.selectedProject = project;
      
      this.isProjectSelected = true; // Set the flag to true when a project is selected
      this.tasks$ = this.projectService.getTasks(project.id!);
      this.router.navigate(['/tasks', project.id]); // Navigate to the project page
    }
  }

  editProject(project: Project) {
    this.router.navigate(['/pedit', project.id]); // Navigate to the project edit page
  }
  // 🔹 Delete a project
  deleteProject(projectId: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId);
    }
  }

  // 🔹 Share a project with another user
  shareProject(projectId: string, userId: string) {
    this.projectService.shareProject(projectId, userId);
  }

  
}
