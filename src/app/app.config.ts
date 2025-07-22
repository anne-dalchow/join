import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-7e54b',
        appId: '1:424943017502:web:0a1d69d4e4a85c3569580f',
        storageBucket: 'join-7e54b.firebasestorage.app',
        apiKey: 'AIzaSyCnn-zzaGhj-Hh20QYqwumfSFlpFGNIyxs',
        authDomain: 'join-7e54b.firebaseapp.com',
        messagingSenderId: '424943017502',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
  ],
};
