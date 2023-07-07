import {
  Component,
  ElementRef,
  Host,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import anime from 'animejs';
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent {
  @ViewChild('centerOverlay') centerOverlay!: ElementRef;
  @ViewChild('snowboarder') snowboarder!: ElementRef;
  @ViewChild('flowingText') flowingText!: ElementRef;

  flowingTextStartOffset = 0;
  flowingTextInitOffset = 0;
  flowTextMaxOffset = 0;
  flowTextVertiScrollMaxOffset = 0;
  backgroundSrc = 'assets/graphics/skillsCenterGraphic.png';
  scrollOffset = 0;
  scrollHeight = 0;
  clientHeight = 0;
  offsetY = 0;
  offsetX = 0;
  boxEdgeX = 0;
  boxEdgeY = 0;
  init = false;
  snoboarderStarterX = 0;
  snoboarderStarterY = 0;
  flowingTextWidth = 0;
  boxWidth = 0;
  fakeHoriScrolling = false;
  fakeHoriScrollingSteps = 50;
  constructor(private hostRef: ElementRef) {}
  getScrollPercentage(): number {
    const scrollableHeight = this.scrollHeight - this.clientHeight;
    return this.scrollOffset / scrollableHeight;
  }
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollOffset = target.scrollTop;
    this.scrollHeight = target.scrollHeight;
    this.clientHeight = target.clientHeight;
    const scrollPercentage = this.getScrollPercentage();
    this.flowingTextStartOffset =
      this.flowingTextInitOffset +
      this.flowTextVertiScrollMaxOffset * scrollPercentage;
    this.flowingText.nativeElement.setAttribute(
      'startOffset',
      this.flowingTextStartOffset
    );
  }
  varUpdate() {
    const overlayRect =
      this.centerOverlay.nativeElement.getBoundingClientRect();
    if (overlayRect.left == 0) {
      return;
    }
    this.boxEdgeX = overlayRect.width * 0.8 + overlayRect.left;
    this.boxEdgeY = overlayRect.height * 0.8 + overlayRect.top;
    this.snoboarderStarterX =
      this.snowboarder.nativeElement.getBoundingClientRect().left;
    this.snoboarderStarterY =
      this.snowboarder.nativeElement.getBoundingClientRect().top;
    this.flowingTextWidth =
      this.flowingText.nativeElement.getBoundingClientRect().width;

    this.boxWidth = overlayRect.width;
    this.flowTextMaxOffset = this.boxWidth * 0.6;
    this.flowTextVertiScrollMaxOffset = this.boxWidth * 0.2;

    this.flowingTextInitOffset = -this.flowingTextWidth * 2;
    this.init = true;
  }
  updateSnowboarderPosition() {
    const scrollPercentage = this.getScrollPercentage();

    const fakeHoriScrollingPercentage =
      1 -
      (this.flowTextMaxOffset - this.flowingTextStartOffset) /
        (this.flowTextMaxOffset - this.flowingTextInitOffset);
    this.offsetX =
      (this.boxEdgeX - this.snoboarderStarterX) *
      ((scrollPercentage + fakeHoriScrollingPercentage) / 2);

    this.offsetY =
      (this.boxEdgeY - this.snoboarderStarterY) *
      ((scrollPercentage + fakeHoriScrollingPercentage) / 2);
  }
  ngAfterViewInit() {}
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.init) {
      this.varUpdate();
      this.flowingTextStartOffset = -this.flowingTextWidth * 0.5;
    }
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.init) {
      return;
    }

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const boundingRect = this.hostRef.nativeElement.getBoundingClientRect();
    if (
      mouseX > this.boxEdgeX ||
      mouseY > this.boxEdgeY ||
      mouseX < boundingRect.left ||
      mouseY < boundingRect.top
    ) {
      return;
    }
    this.updateSnowboarderPosition();
    if (event.deltaY > 0) {
      if (this.getScrollPercentage() > 0.95) {
        this.fakeHoriScrolling = true;
      } else {
        this.fakeHoriScrolling = false;
        return;
      }
      if (this.flowingTextStartOffset < this.flowTextMaxOffset) {
        this.flowingTextStartOffset += this.fakeHoriScrollingSteps;
        this.flowingText.nativeElement.setAttribute(
          'startOffset',
          this.flowingTextStartOffset
        );
      }
    }
    if (event.deltaY < 0) {
      if (
        this.flowingTextStartOffset >
        this.flowingTextInitOffset + this.flowTextVertiScrollMaxOffset
      ) {
        this.flowingTextStartOffset -= this.fakeHoriScrollingSteps;
        this.flowingText.nativeElement.setAttribute(
          'startOffset',
          this.flowingTextStartOffset
        );
      } else {
        this.fakeHoriScrolling = false;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.varUpdate();
  }

  skills = [
    { asset: 'assets/icons/HTML5.svg', name: 'HTML5' },
    {
      asset: 'assets/icons/CSS3.svg',
      name: 'CSS3',
    },
    {
      asset: 'assets/icons/Angular.svg',
      name: 'Angular',
    },
    {
      asset: 'assets/icons/Git.svg',
      name: 'Git',
    },
    {
      asset: 'assets/icons/NodeJS.png',
      name: 'NodeJS',
    },
    {
      asset: 'assets/icons/Docker.svg',
      name: 'Docker',
    },
    {
      asset: 'assets/icons/PostgreSQL.svg',
      name: 'PostgreSQL',
    },
  ];
}
