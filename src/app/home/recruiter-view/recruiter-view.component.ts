import {
  OnInit,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BotService } from '../../service/bot.service';

type RecruiterSection = 'profile' | 'projects' | 'stack' | 'trajectory' | 'contact';
type RecruiterQuestion = 'hire' | 'experience' | 'spring' | 'security' | 'education' | 'projects';

interface RecruiterProject {
  id: 'kuichi-web' | 'patota' | 'kuichi-app';
  chapter: string;
  name: string;
  category: string;
  summary: string;
  problem: string;
  contribution: string;
  role: string;
  techs: string[];
  demoUrl: string;
  architectureModal: string;
  archTitle: string;
  archSection1Title: string;
  archSection1Desc: string;
  archSection2Title: string;
  archSection2Desc?: string;
  archBullets?: string[];
}

interface RecruiterMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface RecruiterWheelStop {
  targetId: string;
  section: RecruiterSection;
}

@Component({
  selector: 'app-recruiter-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter-view.component.html',
  styleUrls: ['./recruiter-view.component.css']
})
export class RecruiterViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('trackedSection') trackedSections?: QueryList<ElementRef<HTMLElement>>;

  get sections() {
    return this.currentLanguage === 'es' ? [
      { id: 'profile' as RecruiterSection, label: 'Perfil', shortLabel: '01' },
      { id: 'projects' as RecruiterSection, label: 'Proyectos', shortLabel: '02' },
      { id: 'stack' as RecruiterSection, label: 'Tecnologías', shortLabel: '03' },
      { id: 'trajectory' as RecruiterSection, label: 'Trayectoria', shortLabel: '04' },
      { id: 'contact' as RecruiterSection, label: 'Contacto', shortLabel: '05' }
    ] : [
      { id: 'profile' as RecruiterSection, label: 'Profile', shortLabel: '01' },
      { id: 'projects' as RecruiterSection, label: 'Projects', shortLabel: '02' },
      { id: 'stack' as RecruiterSection, label: 'Stack', shortLabel: '03' },
      { id: 'trajectory' as RecruiterSection, label: 'Trajectory', shortLabel: '04' },
      { id: 'contact' as RecruiterSection, label: 'Contact', shortLabel: '05' }
    ];
  }

  readonly wheelStops: RecruiterWheelStop[] = [
    { targetId: 'recruiter-profile', section: 'profile' },
    { targetId: 'recruiter-projects', section: 'projects' },
    { targetId: 'recruiter-stack', section: 'stack' },
    { targetId: 'recruiter-stack-more', section: 'stack' },
    { targetId: 'recruiter-trajectory', section: 'trajectory' },
    { targetId: 'recruiter-trajectory-more', section: 'trajectory' },
    { targetId: 'recruiter-contact', section: 'contact' }
  ];

  readonly sectionPageCounts: Record<RecruiterSection, number> = {
    profile: 1,
    projects: 1,
    stack: 2,
    trajectory: 2,
    contact: 1
  };

  readonly projectsEs: RecruiterProject[] = [
    {
      id: 'kuichi-web',
      chapter: '01',
      name: 'Kuichi Web',
      category: 'VET PLATFORM · WEB',
      summary: 'Plataforma web para cuidar mascotas y conectar a sus dueños con servicios veterinarios, registros médicos y ofertas.',
      problem: 'Reunir en una misma experiencia el cuidado, el historial y el acceso a servicios para mascotas.',
      contribution: 'Sistema web que conecta servicios veterinarios, registros médicos y ofertas en una experiencia integrada.',
      role: 'Desarrollo de aplicación web',
      techs: ['Java', 'Spring Boot', 'Angular', 'REST API'],
      demoUrl: 'https://aelstgermain.github.io/kuichiweb/',
      architectureModal: '#kuichiWebModal',
      archTitle: 'Kuichi Web · Ingeniería & integración',
      archSection1Title: 'Arquitectura cliente-servidor',
      archSection1Desc: 'Single Page Application construida con Angular y conectada a servicios REST desarrollados con Java y Spring Boot.',
      archSection2Title: 'Capas principales',
      archBullets: [
        'Presentación: Angular y TypeScript.',
        'Negocio: Java, Spring Boot y servicios REST.',
        'Datos: Persistencia relacional.'
      ]
    },
    {
      id: 'patota',
      chapter: '02',
      name: 'Patota',
      category: 'COMMUNITY · WEB APP',
      summary: 'Aplicación para convocar grupos de personas y coordinar paseos o actividades al aire libre.',
      problem: 'Facilitar la convocatoria y coordinación de personas para rutas y actividades recreativas.',
      contribution: 'Una experiencia web ligera para organizar salidas y mantener la información del grupo en un mismo lugar.',
      role: 'Diseño y desarrollo web',
      techs: ['JavaScript', 'HTML5/CSS3', 'Web App', 'UX/UI'],
      demoUrl: 'https://aelstgermain.github.io/Patota',
      architectureModal: '#patotaModal',
      archTitle: 'Patota · Arquitectura & flujos',
      archSection1Title: 'Arquitectura del sistema',
      archSection1Desc: 'Aplicación web modular construida con HTML5 semántico, CSS3 y lógica en JavaScript, enfocada en una experiencia ligera para actividades al aire libre.',
      archSection2Title: 'Flujo de datos',
      archSection2Desc: 'La información de rutas y paseos se conserva mediante almacenamiento local para mantener disponibles los datos esenciales del grupo.',
      archBullets: [
        'Diseño mobile-first.',
        'Interfaz ligera.',
        'Organización de rutas y actividades.'
      ]
    },
    {
      id: 'kuichi-app',
      chapter: '03',
      name: 'Kuichi App',
      category: 'MOBILE · HYBRID APP',
      summary: 'Versión móvil de Kuichi con servicios, promociones veterinarias y seguimiento desde el smartphone.',
      problem: 'Llevar las funciones principales de Kuichi a una experiencia móvil accesible.',
      contribution: 'Aplicación híbrida multiplataforma para consultar servicios y alertas relacionadas con el cuidado de mascotas.',
      role: 'Desarrollo móvil híbrido',
      techs: ['Ionic', 'Angular', 'TypeScript', 'Mobile'],
      demoUrl: 'https://aelstgermain.github.io/kuichiapp',
      architectureModal: '#kuichiAppModal',
      archTitle: 'Kuichi App · Arquitectura híbrida',
      archSection1Title: 'Estructura móvil',
      archSection1Desc: 'Aplicación híbrida construida con Ionic y Angular para acercar los servicios principales de Kuichi al smartphone.',
      archSection2Title: 'Stack',
      archBullets: [
        'Ionic Framework.',
        'Angular y TypeScript.',
        'Experiencia móvil multiplataforma.'
      ]
    }
  ];

  readonly projectsEn: RecruiterProject[] = [
    {
      id: 'kuichi-web',
      chapter: '01',
      name: 'Kuichi Web',
      category: 'VET PLATFORM · WEB',
      summary: 'Web platform for pet care, connecting owners with veterinary services, medical records, and promotional offers.',
      problem: 'Unifying pet care, medical history, and access to services in a single web experience.',
      contribution: 'Web system connecting veterinary services, medical records, and offers in an integrated experience.',
      role: 'Web Application Development',
      techs: ['Java', 'Spring Boot', 'Angular', 'REST API'],
      demoUrl: 'https://aelstgermain.github.io/kuichiweb/',
      architectureModal: '#kuichiWebModal',
      archTitle: 'Kuichi Web · Engineering & Integration',
      archSection1Title: 'Client-Server Architecture',
      archSection1Desc: 'Single Page Application built with Angular and connected to REST services developed with Java and Spring Boot.',
      archSection2Title: 'Core Layers',
      archBullets: [
        'Presentation: Angular & TypeScript.',
        'Business Logic: Java, Spring Boot & REST services.',
        'Data: Relational persistence.'
      ]
    },
    {
      id: 'patota',
      chapter: '02',
      name: 'Patota',
      category: 'COMMUNITY · WEB APP',
      summary: 'Application to gather groups of people and coordinate outdoor walks or activities.',
      problem: 'Facilitating the coordination and recruitment of hikers for routes and recreational outings.',
      contribution: 'A lightweight web experience to organize outings and consolidate group information in one place.',
      role: 'Web Design & Development',
      techs: ['JavaScript', 'HTML5/CSS3', 'Web App', 'UX/UI'],
      demoUrl: 'https://aelstgermain.github.io/Patota',
      architectureModal: '#patotaModal',
      archTitle: 'Patota · Architecture & Flows',
      archSection1Title: 'System Architecture',
      archSection1Desc: 'Modular web application built with semantic HTML5, CSS3, and JavaScript logic, focused on a lightweight experience for outdoor activities.',
      archSection2Title: 'Data Flow',
      archSection2Desc: 'Route and trek information is stored locally to keep essential group data available.',
      archBullets: [
        'Mobile-first design.',
        'Lightweight interface.',
        'Route and activity planning.'
      ]
    },
    {
      id: 'kuichi-app',
      chapter: '03',
      name: 'Kuichi App',
      category: 'MOBILE · HYBRID APP',
      summary: 'Mobile version of Kuichi featuring services, veterinary promotions, and tracking from the smartphone.',
      problem: 'Bringing the core features of Kuichi to an accessible mobile application.',
      contribution: 'Cross-platform hybrid application to query services and alerts related to pet care.',
      role: 'Hybrid Mobile Development',
      techs: ['Ionic', 'Angular', 'TypeScript', 'Mobile'],
      demoUrl: 'https://aelstgermain.github.io/kuichiapp',
      architectureModal: '#kuichiAppModal',
      archTitle: 'Kuichi App · Hybrid Architecture',
      archSection1Title: 'Mobile Structure',
      archSection1Desc: 'Hybrid application built with Ionic and Angular to bring the main services of Kuichi to smartphones.',
      archSection2Title: 'Stack',
      archBullets: [
        'Ionic Framework.',
        'Angular & TypeScript.',
        'Cross-platform mobile experience.'
      ]
    }
  ];

  get projects(): RecruiterProject[] {
    return this.currentLanguage === 'es' ? this.projectsEs : this.projectsEn;
  }

  readonly stackGroupsEs = [
    {
      code: 'SYS.01',
      title: 'Backend & APIs',
      description: 'Servicios, lógica de negocio, seguridad y APIs REST.',
      skills: ['Java', 'Spring Boot', 'Spring MVC', 'Spring Security', 'JPA / Hibernate', 'Node.js', 'Express.js', 'REST APIs']
    },
    {
      code: 'SYS.02',
      title: 'Datos & integración',
      description: 'Bases de datos, integración de sistemas y validación de datos.',
      skills: ['PostgreSQL', 'MySQL', 'SQL', 'Master Data', 'Data Validation', 'System Integration', 'Firebase', 'Supabase']
    },
    {
      code: 'SYS.03',
      title: 'Web & aplicaciones',
      description: 'Interfaces interactivas y adaptadas a distintos dispositivos.',
      skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Ionic', 'Bootstrap']
    },
    {
      code: 'SYS.04',
      title: 'Infraestructura & entrega',
      description: 'Herramientas de despliegue, entrega continua y servidores.',
      skills: ['Linux', 'Docker', 'Nginx', 'Git', 'GitHub', 'GitHub Actions', 'Maven', 'Scrum', 'Documentación técnica']
    },
    {
      code: 'SYS.05',
      title: 'Testing & seguridad',
      description: 'Pruebas de software y conceptos fundamentales de seguridad.',
      skills: ['Postman', 'Jest', 'Jasmine', 'API Testing', 'Fundamentos de seguridad', 'Microsoft Security fundamentals']
    }
  ];

  readonly stackGroupsEn = [
    {
      code: 'SYS.01',
      title: 'Backend & APIs',
      description: 'Services, business logic, security, and REST APIs.',
      skills: ['Java', 'Spring Boot', 'Spring MVC', 'Spring Security', 'JPA / Hibernate', 'Node.js', 'Express.js', 'REST APIs']
    },
    {
      code: 'SYS.02',
      title: 'Data & Integration',
      description: 'Databases, systems integration, and data validation.',
      skills: ['PostgreSQL', 'MySQL', 'SQL', 'Master Data', 'Data Validation', 'System Integration', 'Firebase', 'Supabase']
    },
    {
      code: 'SYS.03',
      title: 'Web & Applications',
      description: 'Interactive interfaces tailored to different devices.',
      skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Ionic', 'Bootstrap']
    },
    {
      code: 'SYS.04',
      title: 'Infrastructure & Delivery',
      description: 'Deployment tools, continuous delivery, and servers.',
      skills: ['Linux', 'Docker', 'Nginx', 'Git', 'GitHub', 'GitHub Actions', 'Maven', 'Scrum', 'Technical Documentation']
    },
    {
      code: 'SYS.05',
      title: 'Testing & Security',
      description: 'Software testing and fundamental security concepts.',
      skills: ['Postman', 'Jest', 'Jasmine', 'API Testing', 'Security Fundamentals', 'Microsoft Security fundamentals']
    }
  ];

  get stackGroups() {
    return this.currentLanguage === 'es' ? this.stackGroupsEs : this.stackGroupsEn;
  }

  readonly timelineEs = [
    {
      marker: '2026',
      meta: 'EXPERIENCIA PROFESIONAL',
      title: 'Product Operations / Data Integration · Follow Up',
      description: 'Trabajo con datos operacionales, Master Data, validación de información, integración de sistemas y consultas SQL. Despliegue y operación de aplicaciones internas usando Linux (Ubuntu Server), Docker, Node.js y Nginx.'
    },
    {
      marker: 'EN CURSO',
      meta: 'FORMACIÓN SUPERIOR',
      title: 'Ingeniería Civil Informática',
      description: 'Estudiante del programa Advance en la Universidad San Sebastián. Formación en ciencias de la computación, algoritmos, bases de datos y arquitectura de sistemas.'
    },
    {
      marker: '2024',
      meta: 'CERTIFICACIÓN MICROSOFT',
      title: 'Security, Compliance, and Identity Fundamentals (SC-900)',
      description: 'Certificación oficial de Microsoft obtenida en 2024. Conocimientos fundamentales en seguridad, cumplimiento e identidad.'
    },
    {
      marker: 'TÍTULO',
      meta: 'FORMACIÓN TÉCNICA',
      title: 'Técnico Analista de Sistemas',
      description: 'Base en ciclo de vida de software, programación orientada a objetos, bases de datos y desarrollo de aplicaciones.'
    },
    {
      marker: 'C1',
      meta: 'IDIOMAS',
      title: 'Inglés avanzado',
      description: 'Lectura de documentación técnica y comunicación fluida en contextos tecnológicos.'
    }
  ];

  readonly timelineEn = [
    {
      marker: '2026',
      meta: 'PROFESSIONAL EXPERIENCE',
      title: 'Product Operations / Data Integration · Follow Up',
      description: 'Working with operational data, Master Data, information validation, systems integration, and SQL queries. Deployment and operation of internal apps using Linux (Ubuntu Server), Docker, Node.js, and Nginx.'
    },
    {
      marker: 'IN PROGRESS',
      meta: 'HIGHER EDUCATION',
      title: 'Civil Computer Engineering',
      description: 'Advance program student at Universidad San Sebastián. Training in computer science, algorithms, databases, and systems architecture.'
    },
    {
      marker: '2024',
      meta: 'MICROSOFT CERTIFICATION',
      title: 'Security, Compliance, and Identity Fundamentals (SC-900)',
      description: 'Official Microsoft certification obtained in 2024. Foundational knowledge in security, compliance, and identity.'
    },
    {
      marker: 'DEGREE',
      meta: 'TECHNICAL EDUCATION',
      title: 'Systems Analyst Technician',
      description: 'Solid grounding in software lifecycle, object-oriented programming, databases, and application development.'
    },
    {
      marker: 'C1',
      meta: 'LANGUAGES',
      title: 'Advanced English',
      description: 'Reading technical documentation and fluent communication in professional technology contexts.'
    }
  ];

  get timeline() {
    return this.currentLanguage === 'es' ? this.timelineEs : this.timelineEn;
  }

  activeSection: RecruiterSection = 'profile';
  activeSectionPage = 1;
  selectedProject!: RecruiterProject;

  aiMessages: RecruiterMessage[] = [];
  aiTyping = false;

  private observer?: IntersectionObserver;
  private aiTypeTimer?: ReturnType<typeof setInterval>;
  private wheelUnlockTimer?: ReturnType<typeof setTimeout>;
  private wheelAccumulator = 0;
  private wheelDirection = 0;
  private wheelNavigationLocked = false;
  private currentWheelStopIndex = 0;

  constructor(
    private host: ElementRef<HTMLElement>,
    public botService: BotService
  ) { }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const scrollRoot = this.host.nativeElement.querySelector<HTMLElement>('.future-recruiter');

    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const id = visible?.target.getAttribute('data-section') as RecruiterSection | null;
        if (id) {
          this.activeSection = id;
          if (this.wheelStops[this.currentWheelStopIndex]?.section !== id) {
            this.currentWheelStopIndex = this.firstWheelStopFor(id);
            this.activeSectionPage = 1;
          }
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.08, 0.25, 0.5]
      }
    );

    this.trackedSections?.forEach(section => this.observer?.observe(section.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.aiTypeTimer) {
      clearInterval(this.aiTypeTimer);
    }
    if (this.wheelUnlockTimer) {
      clearTimeout(this.wheelUnlockTimer);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey || event.deltaY === 0 || this.shouldKeepNativeScroll(event)) {
      return;
    }

    event.preventDefault();

    const direction = Math.sign(event.deltaY);
    if (direction !== this.wheelDirection) {
      this.wheelAccumulator = 0;
      this.wheelDirection = direction;
    }

    this.wheelAccumulator += event.deltaY;

    if (this.wheelNavigationLocked || Math.abs(this.wheelAccumulator) < 12) {
      return;
    }

    const currentIndex = this.currentWheelStopIndex;
    const nextIndex = Math.min(
      this.wheelStops.length - 1,
      Math.max(0, currentIndex + direction)
    );

    this.wheelAccumulator = 0;

    if (nextIndex === currentIndex) {
      return;
    }

    const destination = this.wheelStops[nextIndex];
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${destination.targetId}`);
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.wheelNavigationLocked = true;
    this.currentWheelStopIndex = nextIndex;
    this.activeSection = destination.section;
    this.activeSectionPage = this.pageForWheelStop(nextIndex);
    if (nextIndex === this.wheelStops.length - 1) {
      const scrollRoot = this.host.nativeElement.querySelector<HTMLElement>('.future-recruiter');
      scrollRoot?.scrollTo({
        top: scrollRoot.scrollHeight,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    } else {
      target?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    this.wheelUnlockTimer = setTimeout(() => {
      this.wheelNavigationLocked = false;
      this.wheelDirection = 0;
      this.wheelAccumulator = 0;
    }, reducedMotion ? 120 : 850);
  }

  navigateTo(event: Event, section: RecruiterSection): void {
    event.preventDefault();
    if (section === 'contact') {
      const scrollRoot = this.host.nativeElement.querySelector<HTMLElement>('.future-recruiter');
      scrollRoot?.scrollTo({
        top: scrollRoot.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      const target = this.host.nativeElement.querySelector<HTMLElement>(`#recruiter-${section}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.currentWheelStopIndex = this.firstWheelStopFor(section);
    this.activeSection = section;
    this.activeSectionPage = 1;
  }

  ngOnInit(): void {
    this.selectedProject = this.projects[0];
    this.aiMessages = [
      {
        sender: 'bot',
        text: this.currentLanguage === 'es'
          ? 'Soy AEL_AI. Puedo guiarte sobre el perfil profesional, la experiencia, el backend, la formación, la seguridad o los proyectos de Sofía.'
          : 'I am AEL_AI. I can guide you on Sofia\'s professional profile, experience, backend, education, security, or projects.'
      }
    ];
  }

  selectProject(project: RecruiterProject): void {
    this.selectedProject = project;
  }

  showPersonalView(): void {
    this.botService.toggleRecruiterMode();
  }

  get currentLanguage(): 'es' | 'en' {
    return this.botService.recruiterLanguage;
  }

  toggleLanguage(): void {
    const nextLang = this.currentLanguage === 'es' ? 'en' : 'es';
    this.botService.setRecruiterLanguage(nextLang);
    this.aiMessages = [
      {
        sender: 'bot',
        text: nextLang === 'es'
          ? 'Soy AEL_AI. Puedo guiarte sobre el perfil profesional, la experiencia, el backend, la formación, la seguridad o los proyectos de Sofía.'
          : 'I am AEL_AI. I can guide you on Sofia\'s professional profile, experience, backend, education, security, or projects.'
      }
    ];
    // Sync selectedProject reference
    const currentId = this.selectedProject.id;
    const synced = this.projects.find(p => p.id === currentId);
    if (synced) {
      this.selectedProject = synced;
    }
  }

  askRecruiterAi(topic: RecruiterQuestion): void {
    if (this.aiTyping) {
      return;
    }

    const questionsEs: Record<RecruiterQuestion, string> = {
      hire: '¿Qué aporta Sofía a un equipo?',
      experience: '¿Cuál es su experiencia profesional?',
      spring: '¿Cuál es su experiencia con backend y APIs?',
      security: '¿Qué conocimientos tiene en seguridad?',
      education: '¿Cuál es su formación académica?',
      projects: '¿Qué proyectos puedo revisar?'
    };

    const responsesEs: Record<RecruiterQuestion, string> = {
      hire: 'Aporta una sólida base en backend (Java/Spring, Node/Express), integración de sistemas, manejo de SQL y datos operacionales, buenas prácticas de documentación, uso de Linux/Docker y fundamentos de seguridad.',
      experience: 'Cuenta con experiencia en Product Operations y Data Integration en Follow Up, trabajando con datos operacionales, Master Data, consultas SQL, validación de información, documentación técnica y despliegues en infraestructura Linux/Docker.',
      spring: 'Desarrolla APIs REST seguras usando Java con Spring Boot/Security/JPA y Node.js con Express, integrándolos con bases de datos relacionales como PostgreSQL y MySQL.',
      security: 'Posee la certificación oficial Microsoft SC-900 (Security, Compliance, and Identity Fundamentals). Aplica fundamentos de desarrollo seguro, control de accesos y administración básica en servidores Linux.',
      education: 'Es Técnico Analista de Sistemas, estudiante de Ingeniería Civil Informática (programa Advance en USS) y cuenta con certificación de inglés avanzado C1.',
      projects: 'Puedes revisar Kuichi Web (veterinaria, Spring/Angular), Patota (grupos de trekking, Web App) y Kuichi App (móvil híbrida, Ionic/Angular). Los tres proyectos están enlazados en este portafolio.'
    };

    const questionsEn: Record<RecruiterQuestion, string> = {
      hire: 'What does Sofía bring to a team?',
      experience: 'What is her professional experience?',
      spring: 'What is her experience with backend and APIs?',
      security: 'What are her security credentials?',
      education: 'What is her educational background?',
      projects: 'Which projects can I review?'
    };

    const responsesEn: Record<RecruiterQuestion, string> = {
      hire: 'She brings a solid backend foundation (Java/Spring, Node/Express), systems integration, database/SQL management, technical documentation best practices, Linux/Docker, fast learning capacity, and security fundamentals.',
      experience: 'She has experience in Product Operations and Data Integration at Follow Up, working with operational data, Master Data, SQL queries, data validation, technical documentation, and deployments on Linux/Docker.',
      spring: 'She develops secure REST APIs using Java with Spring Boot/Security/JPA and Node.js with Express, connecting them with relational databases like PostgreSQL and MySQL.',
      security: 'She holds the Microsoft SC-900 (Security, Compliance, and Identity Fundamentals) certification. She applies secure coding practices, access control, and basic Linux server administration.',
      education: 'She is a Systems Analyst Technician, currently pursuing a B.S. in Civil Computer Engineering (USS Advance), and holds an advanced English C1 certification.',
      projects: 'You can check Kuichi Web (veterinary, Spring/Angular), Patota (hiking groups, Web App), and Kuichi App (hybrid mobile, Ionic/Angular). All three are linked in the projects section.'
    };

    const q = this.currentLanguage === 'es' ? questionsEs : questionsEn;
    const r = this.currentLanguage === 'es' ? responsesEs : responsesEn;

    this.aiMessages.push({ sender: 'user', text: q[topic] });
    this.aiTyping = true;

    setTimeout(() => {
      const messageIndex = this.aiMessages.push({ sender: 'bot', text: '' }) - 1;
      this.typeAiAnswer(r[topic], messageIndex);
    }, 240);
  }

  private typeAiAnswer(answer: string, messageIndex: number): void {
    let character = 0;
    if (this.aiTypeTimer) {
      clearInterval(this.aiTypeTimer);
    }

    this.aiTypeTimer = setInterval(() => {
      if (character < answer.length) {
        this.aiMessages[messageIndex].text += answer.charAt(character);
        character++;
        this.scrollAiLog();
        return;
      }

      this.aiTyping = false;
      if (this.aiTypeTimer) {
        clearInterval(this.aiTypeTimer);
      }
    }, 10);
  }

  private scrollAiLog(): void {
    setTimeout(() => {
      const log = this.host.nativeElement.querySelector<HTMLElement>('.recruiter-ai-log');
      if (log) {
        log.scrollTop = log.scrollHeight;
      }
    });
  }

  private shouldKeepNativeScroll(event: WheelEvent): boolean {
    const target = event.target;
    if (typeof Element === 'undefined' || !(target instanceof Element)) {
      return false;
    }

    if (target.closest('.modal')) {
      return true;
    }

    const nestedScroller = target.closest<HTMLElement>('.recruiter-ai-log');
    if (!nestedScroller) {
      return false;
    }

    const scrollingDown = event.deltaY > 0;
    const canScrollDown =
      nestedScroller.scrollTop + nestedScroller.clientHeight < nestedScroller.scrollHeight - 1;
    const canScrollUp = nestedScroller.scrollTop > 0;

    return scrollingDown ? canScrollDown : canScrollUp;
  }

  private firstWheelStopFor(section: RecruiterSection): number {
    const index = this.wheelStops.findIndex(stop => stop.section === section);
    return index === -1 ? 0 : index;
  }

  private pageForWheelStop(stopIndex: number): number {
    const section = this.wheelStops[stopIndex].section;
    return this.wheelStops
      .slice(0, stopIndex + 1)
      .filter(stop => stop.section === section)
      .length;
  }
}
