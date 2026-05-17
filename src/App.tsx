import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { SideNav } from './components/SideNav';
import { TopNav } from './components/TopNav';
import bookHtml from './content/book.html?raw';
import {
  courseModules,
  defaultModuleId,
  getModuleById,
  getModuleForAnchor,
  type CourseModule,
  type ModuleId
} from './content/sections';

type ModuleHtmlMap = Record<ModuleId, string>;

interface RouteTarget {
  moduleId: ModuleId;
  sectionId: string;
}

const moduleIdSet = new Set<ModuleId>(courseModules.map((module) => module.id));

function parseHash(hashValue: string): RouteTarget {
  const fallbackModule = getModuleById(defaultModuleId)!;
  let hash = hashValue.replace(/^#/, '').trim();

  try {
    hash = decodeURIComponent(hash);
  } catch {
    hash = hashValue.replace(/^#/, '').trim();
  }

  if (!hash) {
    return { moduleId: defaultModuleId, sectionId: fallbackModule.nav[0].id };
  }

  const [candidateModuleId, candidateSectionId] = hash.split('/');
  if (moduleIdSet.has(candidateModuleId as ModuleId)) {
    const module = getModuleById(candidateModuleId)!;
    return {
      moduleId: module.id,
      sectionId: candidateSectionId || module.nav[0].id
    };
  }

  const ownerModule = getModuleForAnchor(hash);
  if (ownerModule) {
    return { moduleId: ownerModule.id, sectionId: hash };
  }

  return { moduleId: defaultModuleId, sectionId: fallbackModule.nav[0].id };
}

function extractModuleHtml(sourceHtml: string, module: CourseModule): string {
  const document = new DOMParser().parseFromString(sourceHtml, 'text/html');
  const pageWrap = document.querySelector('.page-wrap');
  if (!pageWrap) return '';

  const children = Array.from(pageWrap.children);
  const startIndex = children.findIndex((child) => child.id === module.startId);
  const endIndex = module.endBeforeId
    ? children.findIndex((child) => child.id === module.endBeforeId)
    : children.length;
  const start = startIndex >= 0 ? startIndex : 0;
  const end = endIndex >= 0 ? endIndex : children.length;
  const fragment = document.createElement('div');

  children.slice(start, end).forEach((child) => {
    if (child.id === 'icindekiler') return;
    fragment.appendChild(child.cloneNode(true));
  });

  enhanceContent(fragment);
  return fragment.innerHTML;
}

function buildModuleHtmlMap(sourceHtml: string): ModuleHtmlMap {
  return courseModules.reduce((accumulator, module) => {
    accumulator[module.id] = extractModuleHtml(sourceHtml, module);
    return accumulator;
  }, {} as ModuleHtmlMap);
}

function enhanceContent(fragment: HTMLElement) {
  wrapPromptBlocks(fragment);
  wrapExerciseBoxes(fragment);
  prepareTemplateLibrary(fragment);
}

function wrapPromptBlocks(fragment: HTMLElement) {
  Array.from(fragment.querySelectorAll('pre')).forEach((pre) => {
    if (pre.closest('details')) return;

    const document = pre.ownerDocument;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const body = document.createElement('div');
    const toolbar = document.createElement('div');
    const button = document.createElement('button');

    details.className = 'disclosure copy-disclosure';
    summary.textContent = getPromptSummary(pre);
    body.className = 'disclosure-body copy-block';
    toolbar.className = 'copy-toolbar';
    button.className = 'copy-btn';
    button.type = 'button';
    button.textContent = 'Kopyala';
    button.setAttribute('data-copy-button', 'true');

    toolbar.appendChild(button);
    details.append(summary, body);
    pre.parentElement?.insertBefore(details, pre);
    body.append(toolbar, pre);
  });
}

function getPromptSummary(pre: Element): string {
  const text = pre.textContent || '';
  if (text.includes('You are a Taste Interviewer')) return 'Kopyalanabilir Taste Interviewer promptunu aç';
  if (text.includes('Bu proje,')) return 'Kopyalanabilir proje talimatını aç';
  if (pre.classList.contains('prompt')) return 'Kopyalanabilir promptu aç';
  return 'Kopyalanabilir kod bloğunu aç';
}

function wrapExerciseBoxes(fragment: HTMLElement) {
  Array.from(fragment.querySelectorAll('.box.exer')).forEach((box) => {
    if (box.closest('details')) return;

    const document = box.ownerDocument;
    const title = box.querySelector('.box-title')?.textContent?.trim() || 'Alıştırma';
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const body = document.createElement('div');

    details.className = 'disclosure exercise-disclosure';
    summary.textContent = `${title} bölümünü aç`;
    body.className = 'disclosure-body';

    details.append(summary, body);
    box.parentElement?.insertBefore(details, box);
    body.appendChild(box);
  });
}

function prepareTemplateLibrary(fragment: HTMLElement) {
  const templateSection = fragment.querySelector('#ek-a');
  if (!templateSection) return;

  Array.from(templateSection.querySelectorAll('ol li')).forEach((item) => {
    if (item.querySelector('[data-copy-button]')) return;

    const document = item.ownerDocument;
    const button = document.createElement('button');
    button.className = 'copy-btn inline-copy-btn';
    button.type = 'button';
    button.textContent = 'Kopyala';
    button.setAttribute('data-copy-button', 'true');
    item.classList.add('copyable-template');
    item.appendChild(button);
  });

  Array.from(templateSection.querySelectorAll('h3')).forEach((heading) => {
    const list = heading.nextElementSibling;
    if (!list || list.tagName !== 'OL') return;

    const document = heading.ownerDocument;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const body = document.createElement('div');

    details.className = 'disclosure template-disclosure';
    summary.textContent = `${heading.textContent?.trim() || 'Şablon'} kalıplarını aç`;
    body.className = 'disclosure-body';

    heading.parentElement?.insertBefore(details, heading);
    heading.remove();
    details.append(summary, body);
    body.appendChild(list);
  });
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function getCopyText(button: HTMLElement): string {
  const template = button.closest('.copyable-template');
  if (template) {
    const clone = template.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-copy-button]').forEach((copyButton) => copyButton.remove());
    return clone.textContent?.trim() || '';
  }

  const copyBlock = button.closest('.copy-block');
  const pre = copyBlock?.querySelector('pre');
  return pre?.textContent?.trim() || '';
}

export default function App() {
  const moduleHtml = useMemo(() => buildModuleHtmlMap(bookHtml), []);
  const initialRoute = useMemo(() => parseHash(window.location.hash), []);
  const [activeModule, setActiveModule] = useState<ModuleId>(initialRoute.moduleId);
  const [activeSection, setActiveSection] = useState(initialRoute.sectionId);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(initialRoute.sectionId);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const currentModule = getModuleById(activeModule) || getModuleById(defaultModuleId)!;

  useEffect(() => {
    function syncFromHash() {
      const route = parseHash(window.location.hash);
      setActiveModule(route.moduleId);
      setActiveSection(route.sectionId);
      setPendingScrollId(route.sectionId);
      setSideNavOpen(false);
    }

    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (!pendingScrollId) return;

    const timeout = window.setTimeout(() => {
      const target = document.getElementById(pendingScrollId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setPendingScrollId(null);
    }, 40);

    return () => window.clearTimeout(timeout);
  }, [activeModule, pendingScrollId]);

  useEffect(() => {
    const sectionIds = currentModule.nav.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    function updateActiveSection() {
      let current = sectionIds[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 150) {
          current = element.id;
        } else {
          break;
        }
      }
      setActiveSection(current);
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [currentModule, activeModule]);

  function navigateToModule(moduleId: ModuleId) {
    const module = getModuleById(moduleId)!;
    setActiveModule(moduleId);
    setActiveSection(module.nav[0].id);
    setSideNavOpen(false);
    window.history.pushState(null, '', `#${moduleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToSection(sectionId: string) {
    const ownerModule = getModuleForAnchor(sectionId) || currentModule;
    setActiveModule(ownerModule.id);
    setActiveSection(sectionId);
    setPendingScrollId(sectionId);
    setSideNavOpen(false);
    window.history.pushState(null, '', `#${ownerModule.id}/${sectionId}`);
  }

  async function handleContentClick(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const copyButton = target.closest<HTMLElement>('[data-copy-button]');
    if (copyButton) {
      event.preventDefault();
      const text = getCopyText(copyButton);
      await copyText(text);
      const previousText = copyButton.textContent || 'Kopyala';
      copyButton.textContent = 'Kopyalandı';
      window.setTimeout(() => {
        copyButton.textContent = previousText;
      }, 1400);
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      const sectionId = href?.replace(/^#/, '');
      if (sectionId) {
        event.preventDefault();
        navigateToSection(sectionId);
      }
    }
  }

  return (
    <div className="app-shell">
      <TopNav
        modules={courseModules}
        activeModule={activeModule}
        onSelect={navigateToModule}
        onToggleSideNav={() => setSideNavOpen((value) => !value)}
      />
      <main className="course-shell">
        <SideNav
          module={currentModule}
          activeSection={activeSection}
          isOpen={sideNavOpen}
          onClose={() => setSideNavOpen(false)}
          onNavigate={navigateToSection}
        />
        <article
          key={activeModule}
          className="lesson-content"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: moduleHtml[activeModule] }}
        />
      </main>
    </div>
  );
}
