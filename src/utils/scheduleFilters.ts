import { Schedule } from '../types/Schedule';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterOption = 'today' | 'thisWeek' | 'thisMonth' | 'lastWeek' | 'lastMonth' | 'all';
export type StatusFilterOption = 'in-progress' | 'canceled' | 'confirmed' | 'all';

interface FilterOptions {
  dateFilter: DateFilterOption;
  statusFilter: StatusFilterOption;
}

export const filterSchedules = (
  schedules: Schedule[], 
  { dateFilter, statusFilter }: FilterOptions
): Schedule[] => {
  // Primeiro aplica o filtro de data
  const dateFiltered = filterSchedulesByDate(schedules, dateFilter);
  
  // Depois aplica o filtro de status
  return filterSchedulesByStatus(dateFiltered, statusFilter);
};

export const filterSchedulesByDate = (schedules: Schedule[], filter: DateFilterOption): Schedule[] => {
  const today = new Date();

  switch (filter) {
    case 'today':
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfDay(today) && scheduleDate <= endOfDay(today);
      });

    case 'thisWeek':
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfWeek(today, { locale: ptBR }) && 
               scheduleDate <= endOfWeek(today, { locale: ptBR });
      });

    case 'thisMonth':
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfMonth(today) && 
               scheduleDate <= endOfMonth(today);
      });

    case 'lastWeek':
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        const lastWeekStart = startOfWeek(subWeeks(today, 1), { locale: ptBR });
        const lastWeekEnd = endOfWeek(subWeeks(today, 1), { locale: ptBR });
        return scheduleDate >= lastWeekStart && scheduleDate <= lastWeekEnd;
      });

    case 'lastMonth':
      return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        return scheduleDate >= lastMonthStart && scheduleDate <= lastMonthEnd;
      });

    default:
      return schedules;
  }
};

const filterSchedulesByStatus = (schedules: Schedule[], filter: StatusFilterOption): Schedule[] => {
  if (filter === 'all') return schedules;
  return schedules.filter(schedule => schedule.status === filter);
};

export const getFilterLabels = (filters: FilterOptions): string => {
  const dateLabel = getDateFilterLabel(filters.dateFilter);
  const statusLabel = getStatusFilterLabel(filters.statusFilter);
  
  if (filters.dateFilter === 'all' && filters.statusFilter === 'all') {
    return 'Todos os agendamentos';
  }
  
  if (filters.dateFilter === 'all') {
    return statusLabel;
  }
  
  if (filters.statusFilter === 'all') {
    return dateLabel;
  }
  
  return `${dateLabel} - ${statusLabel}`;
};

const getDateFilterLabel = (filter: DateFilterOption): string => {
  const labels: Record<DateFilterOption, string> = {
    today: 'Para hoje',
    thisWeek: 'Desta semana',
    thisMonth: 'Deste mês',
    lastWeek: 'Semana anterior',
    lastMonth: 'Mês anterior',
    all: 'Todos'
  };
  return labels[filter];
};

const getStatusFilterLabel = (filter: StatusFilterOption): string => {
  const labels: Record<StatusFilterOption, string> = {
    'in-progress': 'Em andamento',
    'canceled': 'Cancelados',
    'confirmed': 'Confirmados',
    'all': 'Todos os status'
  };
  return labels[filter];
};

export const filterOptions = {
  date: [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Para hoje' },
    { value: 'thisWeek', label: 'Desta semana' },
    { value: 'thisMonth', label: 'Deste mês' },
    { value: 'lastWeek', label: 'Semana anterior' },
    { value: 'lastMonth', label: 'Mês anterior' }
  ],
  status: [
    { value: 'all', label: 'Todos os status' },
    { value: 'confirmed', label: 'Confirmados' },
    { value: 'in-progress', label: 'Em andamento' },
    { value: 'canceled', label: 'Cancelados' }
  ]
} as const;