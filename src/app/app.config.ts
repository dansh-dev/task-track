import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "task-track-8291e", appId: "1:578947747915:web:2f7ac92151e2e0e68a7dce", storageBucket: "task-track-8291e.firebasestorage.app", apiKey: "AIzaSyA2ADxAoIfYyraZ1FTIjOW9T3ExZev-LB8", authDomain: "task-track-8291e.firebaseapp.com", messagingSenderId: "578947747915", measurementId: "G-4R5WT7T2JZ" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "task-track-8291e", appId: "1:578947747915:web:2f7ac92151e2e0e68a7dce", storageBucket: "task-track-8291e.firebasestorage.app", apiKey: "AIzaSyA2ADxAoIfYyraZ1FTIjOW9T3ExZev-LB8", authDomain: "task-track-8291e.firebaseapp.com", messagingSenderId: "578947747915", measurementId: "G-4R5WT7T2JZ" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "task-track-8291e", appId: "1:578947747915:web:2f7ac92151e2e0e68a7dce", storageBucket: "task-track-8291e.firebasestorage.app", apiKey: "AIzaSyA2ADxAoIfYyraZ1FTIjOW9T3ExZev-LB8", authDomain: "task-track-8291e.firebaseapp.com", messagingSenderId: "578947747915", measurementId: "G-4R5WT7T2JZ" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
