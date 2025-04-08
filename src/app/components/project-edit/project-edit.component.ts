import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { filter, Observable } from 'rxjs';


import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';


import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';

import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-project-edit',
  imports: [CommonModule, MatButton, MatCard, MatCardActions, FormsModule],
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  projects$!: Observable<Project>; // Observable to get a project
  selectedProject: Project | null = null; // Store the selected project for viewing/editing tasks
  editedProject: Project = {
    // For creating a new project
    name: '',
    description: '',
    ownerId: '',
    sharedWith: [],
    creationDate: new Date(),
  };
  sharedUsers: string = '';
  
  
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    public router: Router,
    public authService: AuthService,
    private auth: Auth
  ) {}

  projectID = this.activatedRoute.snapshot.params['id'];

  ngOnInit() {
     this.projects$ = this.projectService
          .getProjectById(this.projectID)
          .pipe(filter((project): project is Project => !!project));
     this.projects$.subscribe((project: Project) => {
        console.log('Project:', project);
        this.editedProject = project;

      this.sharedUsers = project.sharedWith.join(', '); // Convert array to comma-separated string
     });
  }


  updateProject() {
    this.editedProject.sharedWith = this.sharedUsers.split(',').map((user: string) => user.trim());
    this.projectService.updateProject(this.projectID, this.editedProject).then(() => {
      console.log('Project updated successfully');
      this.router.navigate(['/projects']);
    });
  }
}
