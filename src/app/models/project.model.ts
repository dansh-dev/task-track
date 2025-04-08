export interface Project {
    id?: string;
    name: string;
    description?: string;
    creationDate: Date;
    ownerId: string;   
    sharedWith: string[];      
  }
  