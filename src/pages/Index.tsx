import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { vacancies as initialVacancies, resumes as initialResumes, locationOptions, experienceOptions, type Vacancy, type Resume } from '@/data/mockData';

type Tab = 'vacancies' | 'resumes' | 'search';

const SKILL_COLORS: Record<string, string> = {
  React: 'bg-blue-50 text-blue-700',
  TypeScript: 'bg-indigo-50 text-indigo-700',
  Python: 'bg-yellow-50 text-yellow-700',
  SQL: 'bg-orange-50 text-orange-700',
  Figma: 'bg-pink-50 text-pink-700',
  CRM: 'bg-purple-50 text-purple-700',
  Git: 'bg-gray-100 text-gray-700',
  Docker: 'bg-cyan-50 text-cyan-700',
  Excel: 'bg-green-50 text-green-700',
  PostgreSQL: 'bg-teal-50 text-teal-700',
  default: 'bg-slate-100 text-slate-600',
};
const getSkillColor = (skill: string) => SKILL_COLORS[skill] || SKILL_COLORS.default;
const formatSalary = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

const emptyVacancy = (): Omit<Vacancy, 'id'> => ({
  title: '', company: '', location: '', salaryMin: 0, salaryMax: 0,
  experience: '', skills: [], type: 'Полный день', postedAt: new Date().toISOString().slice(0, 10),
  description: '', status: 'active',
});
const emptyResume = (): Omit<Resume, 'id'> => ({
  name: '', position: '', location: '', salaryExpected: 0, experience: '',
  skills: [], education: '', age: 0, updatedAt: new Date().toISOString().slice(0, 10),
  summary: '', status: 'active',
});

export default function Index() {
  const [tab, setTab] = useState<Tab>('vacancies');

  // Data state
  const [vacancyList, setVacancyList] = useState<Vacancy[]>(initialVacancies);
  const [resumeList, setResumeList] = useState<Resume[]>(initialResumes);

  // Detail modals
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  // Vacancy form
  const [vacancyFormOpen, setVacancyFormOpen] = useState(false);
  const [vacancyFormData, setVacancyFormData] = useState<Omit<Vacancy, 'id'>>(emptyVacancy());
  const [editingVacancyId, setEditingVacancyId] = useState<number | null>(null);
  const [vacancySkillInput, setVacancySkillInput] = useState('');

  // Resume form
  const [resumeFormOpen, setResumeFormOpen] = useState(false);
  const [resumeFormData, setResumeFormData] = useState<Omit<Resume, 'id'>>(emptyResume());
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null);
  const [resumeSkillInput, setResumeSkillInput] = useState('');

  // Delete confirmations
  const [deleteVacancyId, setDeleteVacancyId] = useState<number | null>(null);
  const [deleteResumeId, setDeleteResumeId] = useState<number | null>(null);

  // Filters
  const [vSearch, setVSearch] = useState('');
  const [vLocation, setVLocation] = useState('all');
  const [vExperience, setVExperience] = useState('all');
  const [vSalaryRange, setVSalaryRange] = useState([0, 250000]);
  const [vSkill, setVSkill] = useState('');

  const [rSearch, setRSearch] = useState('');
  const [rLocation, setRLocation] = useState('all');
  const [rSalaryRange, setRSalaryRange] = useState([0, 250000]);
  const [rSkill, setRSkill] = useState('');

  const [globalQuery, setGlobalQuery] = useState('');
  const [globalType, setGlobalType] = useState<'all' | 'vacancies' | 'resumes'>('all');

  // Filtered lists
  const filteredVacancies = useMemo(() => vacancyList.filter(v => {
    const q = vSearch.toLowerCase();
    return (
      (!q || v.title.toLowerCase().includes(q) || v.company.toLowerCase().includes(q)) &&
      (vLocation === 'all' || v.location === vLocation) &&
      (vExperience === 'all' || v.experience === vExperience) &&
      v.salaryMin >= vSalaryRange[0] && v.salaryMax <= vSalaryRange[1] + 10000 &&
      (!vSkill || v.skills.some(s => s.toLowerCase().includes(vSkill.toLowerCase())))
    );
  }), [vacancyList, vSearch, vLocation, vExperience, vSalaryRange, vSkill]);

  const filteredResumes = useMemo(() => resumeList.filter(r => {
    const q = rSearch.toLowerCase();
    return (
      (!q || r.name.toLowerCase().includes(q) || r.position.toLowerCase().includes(q)) &&
      (rLocation === 'all' || r.location === rLocation) &&
      r.salaryExpected <= rSalaryRange[1] + 10000 &&
      (!rSkill || r.skills.some(s => s.toLowerCase().includes(rSkill.toLowerCase())))
    );
  }), [resumeList, rSearch, rLocation, rSalaryRange, rSkill]);

  const globalResults = useMemo(() => {
    const q = globalQuery.toLowerCase();
    if (!q) return { vacancies: [], resumes: [] };
    return {
      vacancies: globalType !== 'resumes'
        ? vacancyList.filter(v => v.title.toLowerCase().includes(q) || v.company.toLowerCase().includes(q) || v.skills.some(s => s.toLowerCase().includes(q)))
        : [],
      resumes: globalType !== 'vacancies'
        ? resumeList.filter(r => r.name.toLowerCase().includes(q) || r.position.toLowerCase().includes(q) || r.skills.some(s => s.toLowerCase().includes(q)))
        : [],
    };
  }, [globalQuery, globalType, vacancyList, resumeList]);

  // Vacancy CRUD
  const openAddVacancy = () => {
    setEditingVacancyId(null);
    setVacancyFormData(emptyVacancy());
    setVacancySkillInput('');
    setVacancyFormOpen(true);
  };
  const openEditVacancy = (v: Vacancy, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVacancyId(v.id);
    const { id: _id, ...rest } = v;
    setVacancyFormData(rest);
    setVacancySkillInput('');
    setVacancyFormOpen(true);
  };
  const saveVacancy = () => {
    if (editingVacancyId !== null) {
      setVacancyList(prev => prev.map(v => v.id === editingVacancyId ? { ...vacancyFormData, id: editingVacancyId } : v));
      if (selectedVacancy?.id === editingVacancyId) setSelectedVacancy({ ...vacancyFormData, id: editingVacancyId });
    } else {
      const newId = Math.max(0, ...vacancyList.map(v => v.id)) + 1;
      setVacancyList(prev => [...prev, { ...vacancyFormData, id: newId }]);
    }
    setVacancyFormOpen(false);
  };
  const deleteVacancy = (id: number) => {
    setVacancyList(prev => prev.filter(v => v.id !== id));
    if (selectedVacancy?.id === id) setSelectedVacancy(null);
    setDeleteVacancyId(null);
  };

  // Resume CRUD
  const openAddResume = () => {
    setEditingResumeId(null);
    setResumeFormData(emptyResume());
    setResumeSkillInput('');
    setResumeFormOpen(true);
  };
  const openEditResume = (r: Resume, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingResumeId(r.id);
    const { id: _id, ...rest } = r;
    setResumeFormData(rest);
    setResumeSkillInput('');
    setResumeFormOpen(true);
  };
  const saveResume = () => {
    if (editingResumeId !== null) {
      setResumeList(prev => prev.map(r => r.id === editingResumeId ? { ...resumeFormData, id: editingResumeId } : r));
      if (selectedResume?.id === editingResumeId) setSelectedResume({ ...resumeFormData, id: editingResumeId });
    } else {
      const newId = Math.max(0, ...resumeList.map(r => r.id)) + 1;
      setResumeList(prev => [...prev, { ...resumeFormData, id: newId }]);
    }
    setResumeFormOpen(false);
  };
  const deleteResume = (id: number) => {
    setResumeList(prev => prev.filter(r => r.id !== id));
    if (selectedResume?.id === id) setSelectedResume(null);
    setDeleteResumeId(null);
  };

  // Skill helpers
  const addVacancySkill = () => {
    const s = vacancySkillInput.trim();
    if (s && !vacancyFormData.skills.includes(s)) setVacancyFormData(p => ({ ...p, skills: [...p.skills, s] }));
    setVacancySkillInput('');
  };
  const removeVacancySkill = (s: string) => setVacancyFormData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));
  const addResumeSkill = () => {
    const s = resumeSkillInput.trim();
    if (s && !resumeFormData.skills.includes(s)) setResumeFormData(p => ({ ...p, skills: [...p.skills, s] }));
    setResumeSkillInput('');
  };
  const removeResumeSkill = (s: string) => setResumeFormData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const tabs = [
    { key: 'vacancies' as Tab, label: 'Вакансии', icon: 'Briefcase', count: vacancyList.length },
    { key: 'resumes' as Tab, label: 'Резюме', icon: 'FileText', count: resumeList.length },
    { key: 'search' as Tab, label: 'Поиск', icon: 'Search', count: null },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Users" size={16} className="text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-foreground text-lg tracking-tight">КадрПоиск</span>
              <span className="text-muted-foreground text-xs font-mono">v1.0</span>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
                {t.count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}>{t.count}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Icon name="Database" size={13} />
            <span>Локальная БД</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* VACANCIES TAB */}
        {tab === 'vacancies' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Вакансии</h1>
                <p className="text-muted-foreground text-sm">Найдено {filteredVacancies.length} из {vacancyList.length}</p>
              </div>
              <Button onClick={openAddVacancy}>
                <Icon name="Plus" size={15} className="mr-2" />
                Добавить вакансию
              </Button>
            </div>

            <div className="bg-white border border-border rounded-xl p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Должность или компания</label>
                  <div className="relative">
                    <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Разработчик, ТехноГрупп..." className="pl-9" value={vSearch} onChange={e => setVSearch(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Город</label>
                  <Select value={vLocation} onValueChange={setVLocation}>
                    <SelectTrigger><SelectValue placeholder="Все города" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все города</SelectItem>
                      {locationOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Опыт работы</label>
                  <Select value={vExperience} onValueChange={setVExperience}>
                    <SelectTrigger><SelectValue placeholder="Любой опыт" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой опыт</SelectItem>
                      {experienceOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-3 block">
                    Зарплата: {formatSalary(vSalaryRange[0])} — {formatSalary(vSalaryRange[1])}
                  </label>
                  <Slider min={0} max={250000} step={10000} value={vSalaryRange} onValueChange={setVSalaryRange} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Навык</label>
                  <Input placeholder="Python, React, SQL..." value={vSkill} onChange={e => setVSkill(e.target.value)} />
                </div>
              </div>
            </div>

            {filteredVacancies.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Вакансии не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredVacancies.map((v, i) => (
                  <div
                    key={v.id}
                    className="bg-white border border-border rounded-xl p-5 card-hover cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => setSelectedVacancy(v)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-base truncate">{v.title}</h3>
                          <Badge variant="outline" className="text-xs shrink-0 font-normal">{v.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5"><Icon name="Building2" size={13} />{v.company}</span>
                          <span className="flex items-center gap-1.5"><Icon name="MapPin" size={13} />{v.location}</span>
                          <span className="flex items-center gap-1.5"><Icon name="Clock" size={13} />{v.experience}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {v.skills.map(s => (
                            <span key={s} className={`tag ${getSkillColor(s)}`}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-foreground">{formatSalary(v.salaryMin)}</div>
                          <div className="text-xs text-muted-foreground">до {formatSalary(v.salaryMax)}</div>
                          <div className="text-xs text-muted-foreground mt-1">{formatDate(v.postedAt)}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={e => openEditVacancy(v, e)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={14} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteVacancyId(v.id); }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESUMES TAB */}
        {tab === 'resumes' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Резюме</h1>
                <p className="text-muted-foreground text-sm">Найдено {filteredResumes.length} из {resumeList.length}</p>
              </div>
              <Button onClick={openAddResume}>
                <Icon name="Plus" size={15} className="mr-2" />
                Добавить резюме
              </Button>
            </div>

            <div className="bg-white border border-border rounded-xl p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Имя или должность</label>
                  <div className="relative">
                    <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Алексей, разработчик..." className="pl-9" value={rSearch} onChange={e => setRSearch(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Город</label>
                  <Select value={rLocation} onValueChange={setRLocation}>
                    <SelectTrigger><SelectValue placeholder="Все города" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все города</SelectItem>
                      {locationOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Навык</label>
                  <Input placeholder="Python, Figma..." value={rSkill} onChange={e => setRSkill(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-3 block">
                  Ожидаемая зарплата: до {formatSalary(rSalaryRange[1])}
                </label>
                <Slider min={0} max={250000} step={10000} value={rSalaryRange} onValueChange={setRSalaryRange} className="max-w-md" />
              </div>
            </div>

            {filteredResumes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Резюме не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResumes.map((r, i) => (
                  <div
                    key={r.id}
                    className="bg-white border border-border rounded-xl p-5 card-hover cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => setSelectedResume(r)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <span className="text-accent-foreground font-bold text-base">{r.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <h3 className="font-semibold text-foreground truncate">{r.name}</h3>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            <button
                              onClick={e => openEditResume(r, e)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                              title="Редактировать"
                            >
                              <Icon name="Pencil" size={13} />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setDeleteResumeId(r.id); }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                              title="Удалить"
                            >
                              <Icon name="Trash2" size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-primary font-medium mb-1">{r.position}</p>
                        <p className="text-sm font-bold text-foreground mb-2">{formatSalary(r.salaryExpected)}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />{r.location}</span>
                          <span className="flex items-center gap-1"><Icon name="Briefcase" size={11} />{r.experience}</span>
                          <span className="flex items-center gap-1"><Icon name="User" size={11} />{r.age} лет</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.slice(0, 4).map(s => (
                            <span key={s} className={`tag ${getSkillColor(s)}`}>{s}</span>
                          ))}
                          {r.skills.length > 4 && (
                            <span className="tag bg-muted text-muted-foreground">+{r.skills.length - 4}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH TAB */}
        {tab === 'search' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Глобальный поиск</h1>
              <p className="text-muted-foreground text-sm">Поиск по вакансиям и резюме одновременно</p>
            </div>
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="relative mb-4">
                <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Должность, навык, имя кандидата, компания..."
                  className="pl-11 h-12 text-base"
                  value={globalQuery}
                  onChange={e => setGlobalQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'vacancies', 'resumes'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setGlobalType(type)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      globalType === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    {{ all: 'Всё', vacancies: 'Вакансии', resumes: 'Резюме' }[type]}
                  </button>
                ))}
              </div>
            </div>

            {!globalQuery ? (
              <div className="text-center py-16 text-muted-foreground">
                <Icon name="Search" size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-base">Начните вводить запрос</p>
                <p className="text-sm mt-1">Поиск работает по должностям, компаниям, именам и навыкам</p>
              </div>
            ) : (
              <div className="space-y-6">
                {globalResults.vacancies.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Icon name="Briefcase" size={13} />Вакансии ({globalResults.vacancies.length})
                    </h2>
                    <div className="grid gap-3">
                      {globalResults.vacancies.map(v => (
                        <div key={v.id} className="bg-white border border-border rounded-xl p-4 card-hover cursor-pointer" onClick={() => setSelectedVacancy(v)}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{v.title}</h3>
                              <p className="text-sm text-muted-foreground">{v.company} · {v.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-foreground">{formatSalary(v.salaryMin)}–{formatSalary(v.salaryMax)}</p>
                              <p className="text-xs text-muted-foreground">{v.experience}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {globalResults.resumes.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Icon name="FileText" size={13} />Резюме ({globalResults.resumes.length})
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {globalResults.resumes.map(r => (
                        <div key={r.id} className="bg-white border border-border rounded-xl p-4 card-hover cursor-pointer" onClick={() => setSelectedResume(r)}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                              <span className="text-accent-foreground font-bold text-sm">{r.name[0]}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{r.name}</p>
                              <p className="text-sm text-muted-foreground">{r.position} · {r.location}</p>
                            </div>
                            <span className="font-bold text-sm text-foreground">{formatSalary(r.salaryExpected)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {globalResults.vacancies.length === 0 && globalResults.resumes.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Ничего не найдено по запросу «{globalQuery}»</p>
                    <p className="text-sm mt-1">Попробуйте другое слово или навык</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Vacancy Detail Modal */}
      <Dialog open={!!selectedVacancy} onOpenChange={() => setSelectedVacancy(null)}>
        <DialogContent className="max-w-2xl">
          {selectedVacancy && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl font-bold mb-1">{selectedVacancy.title}</DialogTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="Building2" size={13} />{selectedVacancy.company}</span>
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={13} />{selectedVacancy.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{selectedVacancy.type}</Badge>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Зарплата</p>
                  <p className="font-bold text-foreground text-sm">{formatSalary(selectedVacancy.salaryMin)}–{formatSalary(selectedVacancy.salaryMax)}</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-xs text-muted-foreground mb-1">Опыт</p>
                  <p className="font-bold text-foreground text-sm">{selectedVacancy.experience}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Опубликовано</p>
                  <p className="font-bold text-foreground text-sm">{formatDate(selectedVacancy.postedAt)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Описание вакансии</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedVacancy.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Требуемые навыки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVacancy.skills.map(s => (
                    <span key={s} className={`tag text-sm px-3 py-1 ${getSkillColor(s)}`}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={() => { openEditVacancy(selectedVacancy, { stopPropagation: () => {} } as React.MouseEvent); setSelectedVacancy(null); }}>
                  <Icon name="Pencil" size={15} className="mr-2" />
                  Редактировать
                </Button>
                <Button variant="outline">
                  <Icon name="Phone" size={15} className="mr-2" />
                  Контакты
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-red-50" onClick={() => { setDeleteVacancyId(selectedVacancy.id); setSelectedVacancy(null); }}>
                  <Icon name="Trash2" size={15} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Resume Detail Modal */}
      <Dialog open={!!selectedResume} onOpenChange={() => setSelectedResume(null)}>
        <DialogContent className="max-w-2xl">
          {selectedResume && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="text-accent-foreground font-bold text-xl">{selectedResume.name[0]}</span>
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold mb-0.5">{selectedResume.name}</DialogTitle>
                    <p className="text-primary font-medium">{selectedResume.position}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Icon name="MapPin" size={13} />{selectedResume.location}</span>
                      <span className="flex items-center gap-1"><Icon name="User" size={13} />{selectedResume.age} лет</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Зарплата</p>
                  <p className="font-bold text-foreground text-sm">{formatSalary(selectedResume.salaryExpected)}</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-xs text-muted-foreground mb-1">Опыт</p>
                  <p className="font-bold text-foreground text-sm">{selectedResume.experience}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Обновлено</p>
                  <p className="font-bold text-foreground text-sm">{formatDate(selectedResume.updatedAt)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">О себе</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedResume.summary}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Образование</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon name="GraduationCap" size={14} className="text-primary" />
                  {selectedResume.education}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Навыки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map(s => (
                    <span key={s} className={`tag text-sm px-3 py-1 ${getSkillColor(s)}`}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={() => { openEditResume(selectedResume, { stopPropagation: () => {} } as React.MouseEvent); setSelectedResume(null); }}>
                  <Icon name="Pencil" size={15} className="mr-2" />
                  Редактировать
                </Button>
                <Button variant="outline">
                  <Icon name="Phone" size={15} className="mr-2" />
                  Контакты
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-red-50" onClick={() => { setDeleteResumeId(selectedResume.id); setSelectedResume(null); }}>
                  <Icon name="Trash2" size={15} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Vacancy Form Modal */}
      <Dialog open={vacancyFormOpen} onOpenChange={setVacancyFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVacancyId !== null ? 'Редактировать вакансию' : 'Добавить вакансию'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Должность *</label>
              <Input placeholder="Frontend-разработчик" value={vacancyFormData.title} onChange={e => setVacancyFormData(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Компания *</label>
              <Input placeholder="ООО Компания" value={vacancyFormData.company} onChange={e => setVacancyFormData(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Город</label>
              <Select value={vacancyFormData.location || 'Москва'} onValueChange={v => setVacancyFormData(p => ({ ...p, location: v }))}>
                <SelectTrigger><SelectValue placeholder="Выберите город" /></SelectTrigger>
                <SelectContent>
                  {locationOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Зарплата от (₽)</label>
              <Input type="number" placeholder="80000" value={vacancyFormData.salaryMin || ''} onChange={e => setVacancyFormData(p => ({ ...p, salaryMin: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Зарплата до (₽)</label>
              <Input type="number" placeholder="150000" value={vacancyFormData.salaryMax || ''} onChange={e => setVacancyFormData(p => ({ ...p, salaryMax: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Опыт</label>
              <Select value={vacancyFormData.experience || experienceOptions[0]} onValueChange={v => setVacancyFormData(p => ({ ...p, experience: v }))}>
                <SelectTrigger><SelectValue placeholder="Выберите опыт" /></SelectTrigger>
                <SelectContent>
                  {experienceOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип занятости</label>
              <Select value={vacancyFormData.type} onValueChange={v => setVacancyFormData(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Полный день', 'Удалённо', 'Гибрид', 'Частичная занятость'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Описание</label>
              <Textarea placeholder="Опишите обязанности и требования..." rows={3} value={vacancyFormData.description} onChange={e => setVacancyFormData(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Навыки</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Добавить навык..."
                  value={vacancySkillInput}
                  onChange={e => setVacancySkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVacancySkill())}
                />
                <Button type="button" variant="outline" onClick={addVacancySkill}><Icon name="Plus" size={15} /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vacancyFormData.skills.map(s => (
                  <span key={s} className={`tag ${getSkillColor(s)} cursor-pointer`} onClick={() => removeVacancySkill(s)}>
                    {s} <span className="ml-1 opacity-60">×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={saveVacancy} disabled={!vacancyFormData.title || !vacancyFormData.company}>
              {editingVacancyId !== null ? 'Сохранить изменения' : 'Добавить вакансию'}
            </Button>
            <Button variant="outline" onClick={() => setVacancyFormOpen(false)}>Отмена</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Form Modal */}
      <Dialog open={resumeFormOpen} onOpenChange={setResumeFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResumeId !== null ? 'Редактировать резюме' : 'Добавить резюме'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ФИО *</label>
              <Input placeholder="Иван Иванов" value={resumeFormData.name} onChange={e => setResumeFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Желаемая должность *</label>
              <Input placeholder="Frontend-разработчик" value={resumeFormData.position} onChange={e => setResumeFormData(p => ({ ...p, position: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Город</label>
              <Select value={resumeFormData.location || 'Москва'} onValueChange={v => setResumeFormData(p => ({ ...p, location: v }))}>
                <SelectTrigger><SelectValue placeholder="Выберите город" /></SelectTrigger>
                <SelectContent>
                  {locationOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ожидаемая зарплата (₽)</label>
              <Input type="number" placeholder="100000" value={resumeFormData.salaryExpected || ''} onChange={e => setResumeFormData(p => ({ ...p, salaryExpected: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Возраст</label>
              <Input type="number" placeholder="25" value={resumeFormData.age || ''} onChange={e => setResumeFormData(p => ({ ...p, age: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Опыт работы</label>
              <Input placeholder="3 года" value={resumeFormData.experience} onChange={e => setResumeFormData(p => ({ ...p, experience: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Образование</label>
              <Input placeholder="МГУ, специальность..." value={resumeFormData.education} onChange={e => setResumeFormData(p => ({ ...p, education: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">О себе</label>
              <Textarea placeholder="Краткое описание опыта и достижений..." rows={3} value={resumeFormData.summary} onChange={e => setResumeFormData(p => ({ ...p, summary: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Навыки</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Добавить навык..."
                  value={resumeSkillInput}
                  onChange={e => setResumeSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addResumeSkill())}
                />
                <Button type="button" variant="outline" onClick={addResumeSkill}><Icon name="Plus" size={15} /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeFormData.skills.map(s => (
                  <span key={s} className={`tag ${getSkillColor(s)} cursor-pointer`} onClick={() => removeResumeSkill(s)}>
                    {s} <span className="ml-1 opacity-60">×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={saveResume} disabled={!resumeFormData.name || !resumeFormData.position}>
              {editingResumeId !== null ? 'Сохранить изменения' : 'Добавить резюме'}
            </Button>
            <Button variant="outline" onClick={() => setResumeFormOpen(false)}>Отмена</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Vacancy Confirm */}
      <AlertDialog open={deleteVacancyId !== null} onOpenChange={() => setDeleteVacancyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить. Вакансия будет удалена из базы.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => deleteVacancyId !== null && deleteVacancy(deleteVacancyId)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Resume Confirm */}
      <AlertDialog open={deleteResumeId !== null} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить резюме?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить. Резюме будет удалено из базы.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => deleteResumeId !== null && deleteResume(deleteResumeId)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>КадрПоиск — Информационная система подбора кадров</span>
          <span>Курсовой проект · 2026</span>
        </div>
      </footer>
    </div>
  );
}
