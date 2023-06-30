import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
class Project {
  title!: string;
  subtitle!: string;
  description!: string;
  projectIconUrl!: string;
  image!: string;
  link!: string;
  techIconsUrls!: string[];
  techIconsNames!: string[];
  constructor(
    title: string,
    subtitle: string,
    description: string,
    projectIconUrl: string,
    image: string,
    link: string,
    icons: string[],
    iconsNames: string[]
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.image = image;
    this.link = link;
    this.techIconsUrls = icons;
    this.techIconsNames = iconsNames;
    this.projectIconUrl = projectIconUrl;
  }
}

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent {
  projects: Project[] = [];
  curProject!: Project;
  curIndex = 0;

  constructor() {
    this.projects.push(
      new Project(
        'Portfolio Site',
        '/myHead',
        'myHead',
        '../../../../assets/graphics/smileyBlack.png',
        '../../../../assets/imgs/FrontEnd/Portfolio Site.png',
        '',
        ['../../../../assets/graphics/smileyBlack.png'],
        ['Smiley']
      )
    );
    this.projects.push(
      new Project(
        'CounterAds',
        'Full Stack Dev',
        "Using <span class='highlight'>AngularJS</span>, advertisers can showcase their ads, and gamers can try to shoot them down. If they miss, they watch the ad. Incorporating <span class='highlight'>Auth0</span> for security, <span class='highlight'>Socket.IO</span> for real-time play, <span class='highlight'>PostgreSQL</span> for data storage",
        '../../../../assets/graphics/stack.svg',
        '../../../../assets/imgs/CounterAds.png',
        '',
        [
          '../../../../assets/graphics/SocketIO.png',
          '../../../../assets/graphics/NodeJS.png',
          '../../../../assets/graphics/ExpressJS.png',
          '../../../../assets/graphics/Auth0.png',
          '../../../../assets/graphics/PostgreSQL.png',
          '../../../../assets/graphics/Angular.png',
        ],
        ['SocketIO', 'Node.js', 'Express.js', 'Auth0', 'PostgreSQL', 'Angular']
      )
    );
  }

  ngOnInit() {
    this.curProject = this.projects[this.curIndex];
  }

  nextProject() {
    if (this.curIndex < this.projects.length - 1) {
      this.curIndex++;
      this.curProject = this.projects[this.curIndex];
    }
  }

  prevProject() {
    if (this.curIndex > 0) {
      this.curIndex--;
      this.curProject = this.projects[this.curIndex];
    }
  }
}
