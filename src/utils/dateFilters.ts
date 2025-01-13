// src/utils/dateFilters.ts
import { Schedule } from '../types/Schedule';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type DateFilterOption = 'today' | 'thisWeek' | 'thisMonth' | 'lastWeek' | 'lastMonth' | 'all';

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

export const getFilterLabel = (filter: DateFilterOption): string => {
  const labels: Record<DateFilterOption, string> = {
    today: 'Para hoje ',
    thisWeek: 'Desta semana',
    thisMonth: 'Deste mês',
    lastWeek: 'Semana anterior',
    lastMonth: 'Mês anterior',
    all: 'Todos'
  };
  return labels[filter];
};