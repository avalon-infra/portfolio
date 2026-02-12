import { animate, stagger, inView, ElementOrSelector, MotionKeyframesDefinition } from 'motion';
import logger from './logger';

const fadeInAnimation = (elements: ElementOrSelector): void => {
  inView(
    elements,
    ({ target }) => {
      animate(target, { opacity: 1, transform: 'none' }, { delay: 0.2, duration: 0.7, easing: 'ease-in-out' });
    },
    { margin: '-20px 0px -20px 0px' }
  );
};

const runCommonAnimations = (): void => {
  const sections = [...document.getElementsByTagName('section')];
  const topBar = document.getElementById('topBarMenu')!;
  const topBarItems = [...topBar.getElementsByTagName('a')];

  const observerOptions: IntersectionObserverInit = {
    threshold: 0.7,
  };

  const observer = new IntersectionObserver((entries) => {
    const intersectedSections = entries.filter((e) => e.isIntersecting);
    if (intersectedSections.length == 0) return;
    const index = sections.findIndex((s) => s.id == intersectedSections[0].target.id) - 1;
    // reset
    topBarItems.forEach((v) => {
      v.classList.remove('active');
    });
    if (index >= 0 && index < topBarItems.length) {
      topBarItems.find((_, i) => i === index)?.classList.add('active');
    }
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // animate section titles
  const sectionTitles = [...document.getElementsByClassName('section-title')];
  fadeInAnimation(sectionTitles);

  // animate top bar
  fadeInAnimation(document.getElementById('topBar')!);
};

const runHomeSection = (): void => {
  // Mouse animation
  const section1Mouse = document.getElementById('section1Mouse');
  if (!section1Mouse) {
    logger.error("#section1Mouse can't be found in the DOM");
    return;
  }

  const homeSection = document.getElementById('home');
  if (!homeSection) {
    logger.error("#home can't be found in the DOM");
    return;
  }

  const resizeSection1Mouse = (): void => {
    const maxWidth = window.innerWidth * 3;
    const maxHeight = window.innerHeight * 3;
    const size = maxHeight > maxWidth ? maxWidth : maxHeight;

    section1Mouse.style.maskSize = `${size}px ${size}px`;
  };

  homeSection.addEventListener('mousemove', (e) => {
    const halfSize = parseInt(section1Mouse.style.maskSize.split('px')[0]) / 2;
    section1Mouse.style.maskPosition = `${e.clientX - halfSize}px ${e.clientY - halfSize}px`;
  });

  window.addEventListener('resize', () => {
    resizeSection1Mouse();
  });

  resizeSection1Mouse();

  // Matiix310 animation

  const drawStroke = (p: number): MotionKeyframesDefinition => ({
    strokeDashoffset: 1 - p,
    visibility: 'visible',
  });

  animate('#home .title path', drawStroke(1), { delay: stagger(0.1) });
  animate('#home .title path', { fill: 'white' }, { delay: stagger(0.1, { start: 0.2 }) });
};

const runAboutSection = (): void => {
  const experienceContainers = [...document.getElementsByClassName('experience-container')];

  fadeInAnimation(experienceContainers);
};

const runProjectsSection = (): void => {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) {
    logger.error("#projects can't be found in the DOM");
    return;
  }

  const projects = [...projectsSection.getElementsByClassName('project')] as HTMLAnchorElement[];

  projectsSection.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    for (const project of projects) {
      const boundingRect = project.getBoundingClientRect();
      project.style.setProperty('--x', `${(x - boundingRect.left).toString()}px`);
      project.style.setProperty('--y', `${(y - boundingRect.top).toString()}px`);
    }
  });

  fadeInAnimation(projects);
};

const runTechLanguagesSection = (): void => {
  const techs = [...document.querySelectorAll('#techLanguages .languages div')];
  fadeInAnimation(techs);
};

// INIT
runCommonAnimations();
runHomeSection();
runAboutSection();
runProjectsSection();
runTechLanguagesSection();
