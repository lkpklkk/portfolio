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
        "This project is my creative take on a lively portfolio website, with an equal focus on style and substance. The site is built on the <span class='highlight'>AngularJS</span> framework, creating a highly modular, customizable and robust application that's all set for any future updates or maintenance.<br><br>\
        I've brought the site to life using <span class='highlight'>ThreeJS</span> and <span class='highlight'>AnimeJS</span> libraries, which are the driving forces behind most of the 3D interactions and animations you'll see on the site.",
        'assets/graphics/smileyBlack.png',
        'assets/imgs/PortfolioSite.jpg',
        '',
        [
          'assets/icons/Angular.svg',
          'assets/icons/ThreeJS.svg',
          'assets/icons/AnimeJS.png',
        ],
        ['Angular', 'ThreeJS', 'AnimeJS']
      )
    );
    this.projects.push(
      new Project(
        'CounterAds',
        'Full Stack Dev',
        "The project privides a gamified ad inteface that binds users and advertisers.The application, built using the robust <span class='highlight'>AngularJS</span> framework, introduces an engaging way for advertisers to display their ads and for gamers to interact with them - shoot it or view it!<br><br>\
        <span class='highlight'>Auth0</span> has been integrated for secure and fast login. The real-time gaming element is brought to life using the powerful <span class='highlight'>Socket.IO</span> library, enabling instantaneous actions and reactions within the game.<br><br>\
        The backend of the application uses <span class='highlight'>ExpressJS</span> and <span class='highlight'>PostgreSQL</span>, providing a reliable backend support and user data storage.",
        'assets/graphics/stack.svg',
        'assets/imgs/CounterAds.jpg',
        '',
        [
          'assets/icons/SocketIO.png',
          'assets/icons/NodeJS.png',
          'assets/icons/ExpressJS.svg',
          'assets/icons/Auth0.png',
          'assets/icons/PostgreSQL.svg',
          'assets/icons/Angular.svg',
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
