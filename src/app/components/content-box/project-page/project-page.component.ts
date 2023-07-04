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
        'Front End Dev',
        "This project is my creative take on a lively portfolio website, with an equal focus on style and substance. The site is built on the <span class='highlight'>AngularJS</span> framework, creating a highly modular, customizable and robust application that's all set for any future updates or maintenance.\
        <br>I've brought the site to life using <span class='highlight'>ThreeJS</span> and <span class='highlight'>AnimeJS</span> libraries, which are the driving forces behind most of the 3D interactions and animations you'll see on the site.\
        \n In a nutshell, this project isn't just a fun experiment—it's also a practical portfolio website that's ready to showcase my past work and any cool stuff I'll do in the future.",
        '../../../../assets/graphics/smileyBlack.png',
        '../../../../assets/imgs/PortfolioSite.png',
        '',
        [
          '../../../../assets/graphics/Angular.png',
          '../../../../assets/graphics/ThreeJS.svg',
          '../../../../assets/graphics/AnimeJS.png',
        ],
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
