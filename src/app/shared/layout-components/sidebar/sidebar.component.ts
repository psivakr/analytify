import { Component,ViewChild,ElementRef,Renderer2, HostListener  } from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { Subscription, fromEvent } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu,switcherArrowFn} from './sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  // Addding sticky-pin
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {

    const navScrollElement =
      this.elementRef.nativeElement.querySelector('.nav-scroll');
    this.scrolled = window.scrollY > 10;
 
    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.scrollY ||
      this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop ||
      document.body.scrollTop;
 
    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);
 
      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          if (navScrollElement) {
            this.renderer.removeClass(navScrollElement, 'active');
          }
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    });
  }
  //////
  doubleMenuActive: boolean = false;
  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };
  icon!: SafeHtml;
  screenWidth: number;
  eventTriggered: boolean = false;
  // public show: boolean=false;
  public menuItems!: Menu[];
  public menuitemsSubscribe$!: Subscription;
  // // Toggle menu
  // toggleNavActive(item: Menu) {
  //   item.active = !item.active;
  // }
  constructor(
    private navServices: NavService,
    private sanitizer: DomSanitizer,
    public router: Router,
    public renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.screenWidth = window.innerWidth;

    document
      .querySelector('html')
      ?.setAttribute('data-vertical-style', 'overlay');
    document.querySelector('html')?.setAttribute('data-nav-layout', 'vertical');
  }

  ngOnInit() {
    let bodyElement: any = document.querySelector('.main-content');

    bodyElement.onclick = () => {
      if (
        localStorage.getItem('vexelMenu') == 'icon-click' ||
        localStorage.getItem('vexelMenu') == 'menu-click' ||
        localStorage.getItem('vexelMenu') == 'icon-hover' ||
        localStorage.getItem('vexellayout') == 'horizontal'
      ) {
        document
          .querySelectorAll('.main-menu .slide-menu.child1')
          .forEach((ele: any) => {
            ele.style.display = 'none';
          });
      }
    };
    this.menuResizeFn();
    this.menuitemsSubscribe$ = this.navServices.items.subscribe((items) => {
      this.menuItems = items;
    });

    this.ParentActive();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ParentActive();
      }
    });

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }
    switcherArrowFn();
  }

  @ViewChild('iconContainer', { static: true }) iconContainer!: ElementRef;
  getSanitizedSVG(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  } 
//Active Nav State
setNavActive(item: any) {
  this.menuItems?.filter((menuItem) => {
    if (menuItem !== item) {
      menuItem.active = false;
      this.navServices.collapseSidebar = false;
    }
    if (menuItem.children && menuItem.children.includes(item)) {
      menuItem.active = true;
      menuItem.selected = true;
    }
    if (menuItem.children) {
      menuItem.children?.filter((submenuItems) => {
        if (submenuItems.children && submenuItems.children.includes(item)) {
          menuItem.active = true;
          submenuItems.active = true;
          menuItem.selected = true;
          submenuItems.selected = true;
        }
        if (submenuItems.children) {
          submenuItems.children?.forEach((subsubmenuItems) => {
            if (
              subsubmenuItems.children &&
              subsubmenuItems.children.includes(item)
            ) {
              menuItem.active = true;
              submenuItems.active = true;
              subsubmenuItems.active = true;
              menuItem.selected = true;
              submenuItems.selected = true;
              subsubmenuItems.selected = true;
            }
          });
        }
      });
    }
  });
  if(item.nochild && localStorage.getItem('vexelverticalstyles')){
    document.documentElement.setAttribute('data-toggled','double-menu-close')
   }
}

// Toggle menu
toggleNavActive(item: any) {
  if (localStorage.getItem('vexelverticalstyles') == 'icontext') {
    document.querySelector('html')?.setAttribute('data-icon-text','open')
  }else{
    document.querySelector('html')?.removeAttribute('data-icon-text')
  }
    //toggle the double menu 
    if(localStorage.getItem('vexelverticalstyles') == 'doublemenu'){
      if(item.active)return;
      document.querySelector('html')?.setAttribute('data-toggled','double-menu-open')
    }
  if (localStorage.getItem('vexelverticalstyles') == 'doublemenu') {
    if(item.active)return;
    }else{
  }
  if (!item.active) {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems.includes(item)) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children.includes(item)) {
          b.active = false;
        } else {
          b.active = false;
        }
        b?.children?.forEach((c: any) => {
          if (b.children.includes(item)) {
            c.active = false;
          }
        });
      });
    });
  }
  item.active = !item.active;
}
menuOpen() {
  const mainContent = document.querySelector('.main-content') as HTMLElement;

  if (localStorage['Ynexverticalstyles'] === 'icontext' && localStorage['iconText'] !== 'open') {
    // Assuming you have a service or method to update the theme
    this.updateTheme({ ...this.getCurrentTheme(), iconText: 'open' });

    mainContent?.addEventListener('click', (_event) => {
      // Assuming you have a service or method to update the theme
      this.updateTheme({ ...this.getCurrentTheme(), iconText: '' });
    });
  }

  if (localStorage['Ynexverticalstyles'] === 'doublemenu' && this.getCurrentTheme().dataToggled !== 'double-menu-open') {
    // Assuming you have a service or method to update the theme
    this.updateTheme({ ...this.getCurrentTheme(), dataToggled: 'double-menu-open' });
  }
}
  ParentActive() {
    this.menuItems.map((element: any) => {
      if (element.children) {
        element.active = false;
        element.selected = false;
        element.children.map((ele: any) => {
          if (ele.path == this.router.url) {
            element.active = true;
            element.selected = true;
          }
          if (ele.children) {
            ele.active = false;
            ele.children.map((child1: any) => {
              if (child1.path == this.router.url) {
                element.active = true;
                element.selected = true;
                ele.active = true;
              }
            });
          }
        });
      }
    });
  }

  // Replace this method with your actual method or service call to update the theme
  updateTheme(updatedTheme: any) {
    // Implement the logic to update the theme in your application
    // This might involve a service or a method that dispatches an action to update the theme state
    console.log('Update Theme:', updatedTheme);
  }

  // Replace this method with your actual method or service call to get the current theme
  getCurrentTheme(): any {
    // Implement the logic to get the current theme from your application state or service
    // Return the current theme object
    return {};
  }
  ngOnDestroy() {
    this.menuitemsSubscribe$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
    document
      .querySelector('html')
      ?.setAttribute('data-vertical-style', 'overlay');
    document.querySelector('html')?.setAttribute('data-nav-layout', 'vertical');

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
   this.menuResizeFn();
 
    this.screenWidth = window.innerWidth;
 
    // Check if the event hasn't been triggered and the screen width is less than or equal to your breakpoint
    if (!this.eventTriggered && this.screenWidth <= 992) {
      document.documentElement?.setAttribute('data-toggled', 'close')
 
      
      // Trigger your event or perform any action here
      this.eventTriggered = true; // Set the flag to true to prevent further triggering
    } else if (this.screenWidth > 992) {
      // Reset the flag when the screen width goes beyond the breakpoint
      this.eventTriggered = false;
    }
  }
  // Close Nav menu
  WindowPreSize: number[] = [window.innerWidth];
  menuResizeFn(): void {
   this.WindowPreSize.push(window.innerWidth);
 
   if (this.WindowPreSize.length > 2) {
     this.WindowPreSize.shift();
   }
 
   if (this.WindowPreSize.length > 1) {
     const html = document.documentElement;
 
     if (this.WindowPreSize[this.WindowPreSize.length - 1] < 992 && this.WindowPreSize[this.WindowPreSize.length - 2] >= 992) {
       // less than 992
       html.setAttribute('data-toggled', 'close');
     }
 
     if (this.WindowPreSize[this.WindowPreSize.length - 1] >= 992 && this.WindowPreSize[this.WindowPreSize.length - 2] < 992) {
       // greater than 992
       html.removeAttribute('data-toggled');
       document.querySelector('#responsive-overlay')?.classList.remove('active');
 
     }
   }
 }
}
