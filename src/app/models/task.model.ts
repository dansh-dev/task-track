export interface Task {
    id?: string;
    title: string;
    completed: boolean;
    creationDate: Date;
    dueDate: Date;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    tags: string[];
    ownerId: string; 
  }