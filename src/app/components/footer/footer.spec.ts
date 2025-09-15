import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all footer links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerLinks = compiled.querySelectorAll('.footer-link');
    expect(footerLinks.length).toBe(6);
  });

  it('should render version link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const versionLink = compiled.querySelector('.version-link');
    expect(versionLink?.textContent?.trim()).toBe('v0.0.1');
  });

  it('should have correct link text content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkTexts = Array.from(compiled.querySelectorAll('.footer-link')).map(
      link => link.textContent?.trim()
    );
    
    expect(linkTexts).toEqual([
      'contact',
      'support', 
      'terms',
      'privacy',
      'github',
      'author'
    ]);
  });

  it('should have icons for all links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkIcons = compiled.querySelectorAll('.link-icon');
    const branchIcon = compiled.querySelector('.branch-icon');
    
    expect(linkIcons.length).toBe(6);
    expect(branchIcon).toBeTruthy();
  });
});
