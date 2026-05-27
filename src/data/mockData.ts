export interface Vacancy {
  id: number;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  skills: string[];
  type: string;
  postedAt: string;
  description: string;
  status: 'active' | 'closed';
}

export interface Resume {
  id: number;
  name: string;
  position: string;
  location: string;
  salaryExpected: number;
  experience: string;
  skills: string[];
  education: string;
  age: number;
  updatedAt: string;
  summary: string;
  status: 'active' | 'hired';
}

export const vacancies: Vacancy[] = [
  {
    id: 1,
    title: 'Frontend-разработчик',
    company: 'ТехноГрупп',
    location: 'Москва',
    salaryMin: 120000,
    salaryMax: 180000,
    experience: '3–5 лет',
    skills: ['React', 'TypeScript', 'CSS', 'Git'],
    type: 'Полный день',
    postedAt: '2026-05-20',
    description: 'Разработка и поддержка веб-приложений на React. Работа в команде из 8 разработчиков.',
    status: 'active',
  },
  {
    id: 2,
    title: 'Менеджер по продажам',
    company: 'АльфаТрейд',
    location: 'Санкт-Петербург',
    salaryMin: 70000,
    salaryMax: 130000,
    experience: '1–3 года',
    skills: ['CRM', 'Переговоры', 'B2B', 'Excel'],
    type: 'Полный день',
    postedAt: '2026-05-22',
    description: 'Активные продажи продуктов компании корпоративным клиентам. KPI-ориентированная среда.',
    status: 'active',
  },
  {
    id: 3,
    title: 'UX/UI Дизайнер',
    company: 'Студия Pixel',
    location: 'Удалённо',
    salaryMin: 90000,
    salaryMax: 150000,
    experience: '2–4 года',
    skills: ['Figma', 'Sketch', 'Прототипирование', 'UX-research'],
    type: 'Удалённо',
    postedAt: '2026-05-18',
    description: 'Проектирование интерфейсов для мобильных и веб-приложений. Ведение дизайн-системы.',
    status: 'active',
  },
  {
    id: 4,
    title: 'Data Analyst',
    company: 'ФинТех Решения',
    location: 'Москва',
    salaryMin: 100000,
    salaryMax: 160000,
    experience: '2–3 года',
    skills: ['Python', 'SQL', 'Power BI', 'Statistics'],
    type: 'Гибрид',
    postedAt: '2026-05-15',
    description: 'Анализ данных клиентов, построение дашбордов, автоматизация отчётности.',
    status: 'active',
  },
  {
    id: 5,
    title: 'HR-менеджер',
    company: 'МегаХолдинг',
    location: 'Екатеринбург',
    salaryMin: 65000,
    salaryMax: 95000,
    experience: 'до 1 года',
    skills: ['1С:ЗУП', 'Рекрутинг', 'Трудовое право', 'Адаптация'],
    type: 'Полный день',
    postedAt: '2026-05-25',
    description: 'Подбор персонала, ведение кадрового документооборота, onboarding новых сотрудников.',
    status: 'active',
  },
  {
    id: 6,
    title: 'Backend-разработчик (Python)',
    company: 'CloudBase',
    location: 'Удалённо',
    salaryMin: 140000,
    salaryMax: 220000,
    experience: '3–5 лет',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    type: 'Удалённо',
    postedAt: '2026-05-21',
    description: 'Разработка высоконагруженных API-сервисов. Работа с микросервисной архитектурой.',
    status: 'active',
  },
];

export const resumes: Resume[] = [
  {
    id: 1,
    name: 'Алексей Козлов',
    position: 'Frontend-разработчик',
    location: 'Москва',
    salaryExpected: 160000,
    experience: '4 года',
    skills: ['React', 'TypeScript', 'Vue', 'CSS', 'Git'],
    education: 'МГТУ им. Баумана, бакалавр',
    age: 28,
    updatedAt: '2026-05-24',
    summary: 'Опытный разработчик интерфейсов. Участвовал в 12+ коммерческих проектах.',
    status: 'active',
  },
  {
    id: 2,
    name: 'Мария Соколова',
    position: 'Менеджер по продажам',
    location: 'Санкт-Петербург',
    salaryExpected: 100000,
    experience: '2 года',
    skills: ['CRM', 'B2B', 'Переговоры', 'Excel', '1С'],
    education: 'СПбГУ, специалист по маркетингу',
    age: 26,
    updatedAt: '2026-05-23',
    summary: 'Перевыполняла план продаж на 130% в течение 6 кварталов подряд.',
    status: 'active',
  },
  {
    id: 3,
    name: 'Дмитрий Петров',
    position: 'Data Analyst',
    location: 'Москва',
    salaryExpected: 140000,
    experience: '3 года',
    skills: ['Python', 'SQL', 'Tableau', 'Power BI', 'Statistics'],
    education: 'НИУ ВШЭ, факультет бизнес-информатики',
    age: 30,
    updatedAt: '2026-05-20',
    summary: 'Строю аналитические пайплайны и дашборды для бизнес-задач любой сложности.',
    status: 'active',
  },
  {
    id: 4,
    name: 'Наталья Ильина',
    position: 'UX/UI Дизайнер',
    location: 'Удалённо',
    salaryExpected: 130000,
    experience: '3 года',
    skills: ['Figma', 'Adobe XD', 'UX-research', 'Прототипирование'],
    education: 'Школа дизайна РАНХиГС',
    age: 25,
    updatedAt: '2026-05-22',
    summary: 'Создаю продуктовые интерфейсы с фокусом на пользовательский опыт и бизнес-метрики.',
    status: 'active',
  },
  {
    id: 5,
    name: 'Иван Новиков',
    position: 'Backend-разработчик',
    location: 'Казань',
    salaryExpected: 180000,
    experience: '5 лет',
    skills: ['Python', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
    education: 'КФУ, факультет вычислительной математики',
    age: 32,
    updatedAt: '2026-05-19',
    summary: 'Специалист по высоконагруженным системам. Оптимизировал БД с 10x ростом производительности.',
    status: 'active',
  },
  {
    id: 6,
    name: 'Елена Громова',
    position: 'HR-менеджер',
    location: 'Екатеринбург',
    salaryExpected: 80000,
    experience: '2 года',
    skills: ['1С:ЗУП', 'Рекрутинг', 'Трудовое право', 'Адаптация', 'HRMS'],
    education: 'УрФУ, управление персоналом',
    age: 27,
    updatedAt: '2026-05-26',
    summary: 'Закрыла 80+ вакансий за 2 года. Выстроила процесс onboarding с нуля.',
    status: 'active',
  },
];

export const experienceOptions = ['до 1 года', '1–3 года', '2–3 года', '2–4 года', '3–5 лет', '5+ лет'];
export const locationOptions = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Удалённо'];
export const skillOptions = ['React', 'TypeScript', 'Python', 'SQL', 'Figma', 'CRM', 'Git', 'Docker', 'Excel', 'PostgreSQL'];
