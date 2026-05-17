export type ModuleId = 'acilis' | 'modul-1' | 'modul-2' | 'modul-3' | 'ekler';

export interface NavItem {
  id: string;
  label: string;
}

export interface CourseModule {
  id: ModuleId;
  label: string;
  shortLabel: string;
  startId: string;
  endBeforeId?: string;
  nav: NavItem[];
}

export const courseModules: CourseModule[] = [
  {
    id: 'acilis',
    label: 'Açılış',
    shortLabel: 'Açılış',
    startId: 'cover',
    endBeforeId: 'modul-1',
    nav: [
      { id: 'cover', label: 'Kapak' },
      { id: 'acilis', label: 'Bu Kitapçık Nasıl Okunmalı?' }
    ]
  },
  {
    id: 'modul-1',
    label: 'Modül 1',
    shortLabel: 'Modül 1',
    startId: 'modul-1',
    endBeforeId: 'modul-2',
    nav: [
      { id: 'modul-1', label: 'Modül 1 Başlangıç' },
      { id: 'm1-b1', label: 'Yapay Zekâ Nedir?' },
      { id: 'm1-b2', label: 'Yapay Zekânın Kısa Tarihi' },
      { id: 'm1-b3', label: 'İş Hayatında Yapay Zekâ' },
      { id: 'm1-b4', label: 'Büyük Dil Modelleri ve Araçlar' },
      { id: 'm1-b5', label: 'Teknoloji İsmi Yaklaşımı' },
      { id: 'm1-b6', label: 'YZ Fırsatlarını Tespit Etmek' },
      { id: 'm1-b7', label: 'Halüsinasyon ve Doğrulama' },
      { id: 'm1-b8', label: 'Veri Hijyeni ve Etik' },
      { id: 'm1-b9', label: 'Prompt Nedir?' },
      { id: 'm1-b10', label: '6P Çerçevesi' },
      { id: 'm1-b11', label: 'İteratif Geliştirme' },
      { id: 'm1-cheat', label: 'Modül 1 Hızlı Başvuru' }
    ]
  },
  {
    id: 'modul-2',
    label: 'Modül 2',
    shortLabel: 'Modül 2',
    startId: 'modul-2',
    endBeforeId: 'modul-3',
    nav: [
      { id: 'modul-2', label: 'Modül 2 Başlangıç' },
      { id: 'm2-b1', label: "Claude'un Temel Mantığı" },
      { id: 'm2-b2', label: 'Etkili Çalışma Yöntemleri' },
      { id: 'm2-b3', label: 'Claude Desktop' },
      { id: 'm2-b4', label: 'Projects' },
      { id: 'm2-b5', label: 'Artifacts' },
      { id: 'm2-b6', label: 'Skills' },
      { id: 'm2-b7', label: 'Connectors' },
      { id: 'm2-b8', label: 'Dosya ve Analiz Senaryoları' },
      { id: 'm2-b9', label: 'Düşünme Çerçeveleri' },
      { id: 'm2-b10', label: 'Yaratıcılığı Genişletme' },
      { id: 'm2-b11', label: 'Yazma, Revizyon ve Ton' },
      { id: 'm2-b12', label: 'Karar Verme Ortağı' },
      { id: 'm2-b13', label: 'Çoklu Araç Ekosistemi' },
      { id: 'm2-cheat', label: 'Modül 2 Hızlı Başvuru' }
    ]
  },
  {
    id: 'modul-3',
    label: 'Modül 3',
    shortLabel: 'Modül 3',
    startId: 'modul-3',
    endBeforeId: 'ekler',
    nav: [
      { id: 'modul-3', label: 'Modül 3 Başlangıç' },
      { id: 'm3-b1', label: 'Taste Interviewer Yöntemi' },
      { id: 'm3-b1b', label: 'Röportajsız About Me' },
      { id: 'm3-b2', label: 'Projelerde Yansıma' },
      { id: 'm3-b3', label: 'Anti-AI Yazım Rehberi' },
      { id: 'm3-cheat', label: 'Modül 3 Hızlı Başvuru' }
    ]
  },
  {
    id: 'ekler',
    label: 'Ekler',
    shortLabel: 'Ekler',
    startId: 'ekler',
    nav: [
      { id: 'ekler', label: 'Ekler Başlangıç' },
      { id: 'ek-a', label: 'Şablon Kütüphanesi' },
      { id: 'ek-b', label: 'Pre/Post Değerlendirme' },
      { id: 'ek-c', label: 'Glossary' },
      { id: 'kapanis', label: 'Kapanış' },
      { id: 'iletisim', label: 'İletişim' }
    ]
  }
];

export const defaultModuleId: ModuleId = 'acilis';

export function getModuleById(id: string | null | undefined): CourseModule | undefined {
  return courseModules.find((module) => module.id === id);
}

export function getModuleForAnchor(anchorId: string): CourseModule | undefined {
  return courseModules.find((module) =>
    module.nav.some((item) => item.id === anchorId || module.startId === anchorId)
  );
}
