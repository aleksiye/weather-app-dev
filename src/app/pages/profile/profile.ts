import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  deleteForm!: FormGroup;

  isEditingProfile = signal<boolean>(false);
  isEditingPassword = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  showDeleteDialog = signal<boolean>(false);
  
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    // Redirect if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    const user = this.currentUser();
    this.profileForm = this.fb.group({
      username: [user?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    this.deleteForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  toggleEditProfile(): void {
    this.isEditingProfile.update(val => !val);
    if (!this.isEditingProfile()) {
      // Reset form if cancelled
      const user = this.currentUser();
      this.profileForm.patchValue({
        username: user?.username || '',
        email: user?.email || ''
      });
    }
    this.clearMessages();
  }

  toggleEditPassword(): void {
    this.isEditingPassword.update(val => !val);
    if (!this.isEditingPassword()) {
      this.passwordForm.reset();
    }
    this.clearMessages();
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.clearMessages();

    try {
      await this.authService.updateProfile(this.profileForm.value);
      
      this.successMessage.set('Profile updated successfully');
      this.isEditingProfile.set(false);
    } catch (error: any) {
      this.errorMessage.set(error?.error?.error || 'Failed to update profile');
    } finally {
      this.isSaving.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    try {
      await this.authService.changePassword({
        currentPassword,
        newPassword
      });
      
      this.successMessage.set('Password changed successfully');
      this.isEditingPassword.set(false);
      this.passwordForm.reset();
    } catch (error: any) {
      this.errorMessage.set(error?.error?.error || 'Failed to change password');
    } finally {
      this.isSaving.set(false);
    }
  }

  openDeleteDialog(): void {
    this.showDeleteDialog.set(true);
    this.deleteForm.reset();
    this.clearMessages();
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog.set(false);
    this.deleteForm.reset();
  }

  async confirmDeleteAccount(): Promise<void> {
    if (this.deleteForm.invalid) return;

    this.isSaving.set(true);
    this.clearMessages();

    try {
      await this.authService.deleteAccount(this.deleteForm.value);
      
      // Navigate to home page after successful deletion
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage.set(error?.error?.error || 'Failed to delete account');
      this.closeDeleteDialog();
    } finally {
      this.isSaving.set(false);
    }
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
