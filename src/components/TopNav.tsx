import type { CourseModule, ModuleId } from '../content/sections';

const linkedInUrl = 'https://www.linkedin.com/in/nefisebora/';

interface TopNavProps {
  modules: CourseModule[];
  activeModule: ModuleId;
  onSelect: (moduleId: ModuleId) => void;
  onToggleSideNav: () => void;
}

export function TopNav({ modules, activeModule, onSelect, onToggleSideNav }: TopNavProps) {
  return (
    <header className="top-nav" aria-label="Ana bölümler">
      <div className="top-nav-inner">
        <button className="mobile-nav-toggle" type="button" onClick={onToggleSideNav}>
          Bölümler
        </button>
        <div className="brand-lockup">
          <span>YZ Kitapçığı</span>
          <strong>Katılımcı Kaynağı</strong>
          <a href={linkedInUrl} target="_blank" rel="noreferrer">
            Nefise Bora tarafından hazırlandı
          </a>
        </div>
        <nav className="module-tabs" aria-label="Modül seçimi">
          {modules.map((module) => (
            <button
              key={module.id}
              className={module.id === activeModule ? 'active' : ''}
              type="button"
              onClick={() => onSelect(module.id)}
              aria-pressed={module.id === activeModule}
            >
              {module.shortLabel}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
