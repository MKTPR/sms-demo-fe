import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      CommonModule,
      ReactiveFormsModule,
      BrowserAnimationsModule
    ),
  ],
};
