import type { CourseModule } from '../content/sections';

interface SideNavProps {
  module: CourseModule;
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function SideNav({ module, activeSection, isOpen, onClose, onNavigate }: SideNavProps) {
  return (
    <>
      <button
        className={`side-nav-scrim ${isOpen ? 'visible' : ''}`}
        type="button"
        aria-label="Alt navigasyonu kapat"
        onClick={onClose}
      />
      <aside className={`side-nav ${isOpen ? 'open' : ''}`} aria-label={`${module.label} alt başlıkları`}>
        <div className="side-nav-card">
          <div className="side-nav-heading">
            <span>İçindekiler</span>
            <strong>{module.label}</strong>
          </div>
          <nav>
            {module.nav.map((item) => (
              <button
                key={item.id}
                className={item.id === activeSection ? 'active' : ''}
                type="button"
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
