// src/components/ScheduleDateFilter.tsx
import React from 'react';
import { Calendar } from 'lucide-react';
import { DateFilterOption, getFilterLabel } from '../utils/dateFilters';

type Props = {
  currentFilter: DateFilterOption;
  onFilterChange: (filter: DateFilterOption) => void;
};

export default function ScheduleDateFilter({ currentFilter, onFilterChange }: Props) {
  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
        <Calendar className="w-5 h-5 text-amber-500" />
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as DateFilterOption)}
          className="w-full bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
        >
          <option value="all">Todos os agendamentos</option>
          <option value="today">{getFilterLabel('today')}</option>
          <option value="thisWeek">{getFilterLabel('thisWeek')}</option>
          <option value="thisMonth">{getFilterLabel('thisMonth')}</option>
          <option value="lastWeek">{getFilterLabel('lastWeek')}</option>
          <option value="lastMonth">{getFilterLabel('lastMonth')}</option>
        </select>
      </div>
    </div>
  );
}