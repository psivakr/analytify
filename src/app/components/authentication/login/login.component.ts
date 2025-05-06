import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;
  constructor(
    @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
    private renderer: Renderer2,private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
 
    // Remove default app classes to eliminate header/sidebar spacing
    this.renderer.removeClass(this.document.body, 'app');
    this.renderer.removeClass(this.document.body, 'sidebar-mini');
    // Add login-specific classes
    this.renderer.addClass(this.document.body, 'login-img');
    this.renderer.addClass(this.document.body, 'ltr');
  }
  ngOnDestroy(): void {
    // Remove login-specific classes
    this.renderer.removeClass(this.document.body, 'login-img');
    this.renderer.removeClass(this.document.body, 'ltr');
    // Restore default app classes
    this.renderer.addClass(this.document.body, 'app');
    this.renderer.addClass(this.document.body, 'sidebar-mini');
}
  /** Toggles the visibility of the password input */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
