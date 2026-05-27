
CREATE TABLE t_p52708701_local_info_system.vacancies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  salary_min INTEGER NOT NULL DEFAULT 0,
  salary_max INTEGER NOT NULL DEFAULT 0,
  experience TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  type TEXT NOT NULL DEFAULT 'Полный день',
  posted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p52708701_local_info_system.resumes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  salary_expected INTEGER NOT NULL DEFAULT 0,
  experience TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  education TEXT NOT NULL DEFAULT '',
  age INTEGER NOT NULL DEFAULT 0,
  updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO t_p52708701_local_info_system.vacancies (title, company, location, salary_min, salary_max, experience, skills, type, posted_at, description, status) VALUES
('Frontend-разработчик', 'ТехноГрупп', 'Москва', 120000, 180000, '3–5 лет', ARRAY['React','TypeScript','CSS','Git'], 'Полный день', '2026-05-20', 'Разработка и поддержка веб-приложений на React. Работа в команде из 8 разработчиков.', 'active'),
('Менеджер по продажам', 'АльфаТрейд', 'Санкт-Петербург', 70000, 130000, '1–3 года', ARRAY['CRM','Переговоры','B2B','Excel'], 'Полный день', '2026-05-22', 'Активные продажи продуктов компании корпоративным клиентам. KPI-ориентированная среда.', 'active'),
('UX/UI Дизайнер', 'Студия Pixel', 'Удалённо', 90000, 150000, '2–4 года', ARRAY['Figma','Sketch','Прототипирование','UX-research'], 'Удалённо', '2026-05-18', 'Проектирование интерфейсов для мобильных и веб-приложений. Ведение дизайн-системы.', 'active'),
('Data Analyst', 'ФинТех Решения', 'Москва', 100000, 160000, '2–3 года', ARRAY['Python','SQL','Power BI','Statistics'], 'Гибрид', '2026-05-15', 'Анализ данных клиентов, построение дашбордов, автоматизация отчётности.', 'active'),
('HR-менеджер', 'МегаХолдинг', 'Екатеринбург', 65000, 95000, 'до 1 года', ARRAY['1С:ЗУП','Рекрутинг','Трудовое право','Адаптация'], 'Полный день', '2026-05-25', 'Подбор персонала, ведение кадрового документооборота, onboarding новых сотрудников.', 'active'),
('Backend-разработчик (Python)', 'CloudBase', 'Удалённо', 140000, 220000, '3–5 лет', ARRAY['Python','FastAPI','PostgreSQL','Docker','Redis'], 'Удалённо', '2026-05-21', 'Разработка высоконагруженных API-сервисов. Работа с микросервисной архитектурой.', 'active');

INSERT INTO t_p52708701_local_info_system.resumes (name, position, location, salary_expected, experience, skills, education, age, updated_at, summary, status) VALUES
('Алексей Козлов', 'Frontend-разработчик', 'Москва', 160000, '4 года', ARRAY['React','TypeScript','Vue','CSS','Git'], 'МГТУ им. Баумана, бакалавр', 28, '2026-05-24', 'Опытный разработчик интерфейсов. Участвовал в 12+ коммерческих проектах.', 'active'),
('Мария Соколова', 'Менеджер по продажам', 'Санкт-Петербург', 100000, '2 года', ARRAY['CRM','B2B','Переговоры','Excel','1С'], 'СПбГУ, специалист по маркетингу', 26, '2026-05-23', 'Перевыполняла план продаж на 130% в течение 6 кварталов подряд.', 'active'),
('Дмитрий Петров', 'Data Analyst', 'Москва', 140000, '3 года', ARRAY['Python','SQL','Tableau','Power BI','Statistics'], 'НИУ ВШЭ, факультет бизнес-информатики', 30, '2026-05-20', 'Строю аналитические пайплайны и дашборды для бизнес-задач любой сложности.', 'active'),
('Наталья Ильина', 'UX/UI Дизайнер', 'Удалённо', 130000, '3 года', ARRAY['Figma','Adobe XD','UX-research','Прототипирование'], 'Школа дизайна РАНХиГС', 25, '2026-05-22', 'Создаю продуктовые интерфейсы с фокусом на пользовательский опыт и бизнес-метрики.', 'active'),
('Иван Новиков', 'Backend-разработчик', 'Казань', 180000, '5 лет', ARRAY['Python','Go','PostgreSQL','Docker','Kubernetes'], 'КФУ, факультет вычислительной математики', 32, '2026-05-19', 'Специалист по высоконагруженным системам. Оптимизировал БД с 10x ростом производительности.', 'active'),
('Елена Громова', 'HR-менеджер', 'Екатеринбург', 80000, '2 года', ARRAY['1С:ЗУП','Рекрутинг','Трудовое право','Адаптация','HRMS'], 'УрФУ, управление персоналом', 27, '2026-05-26', 'Закрыла 80+ вакансий за 2 года. Выстроила процесс onboarding с нуля.', 'active');
