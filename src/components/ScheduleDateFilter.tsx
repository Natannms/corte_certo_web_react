import { Calendar, LayoutList } from "lucide-react";
import { DateFilterOption, filterOptions, StatusFilterOption } from '../utils/scheduleFilters';

interface Props {
  currentFilter: DateFilterOption;
  onFilterChange: (filter: DateFilterOption) => void;
}
interface scheduleStatusFilterProps {
  statusFilter: string
  handleStatusFilterChange: (statusFilterOption: StatusFilterOption) => void
}

export function ScheduleDateFilter({ currentFilter, onFilterChange }: Props) {
  return (
    <div className="relative mb-4 w-full">
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
        <Calendar className="w-5 h-5 text-amber-500" />
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as DateFilterOption)}
          className="w-full bg-white text-gray-900 text-sm focus:outline-none cursor-pointer" // Mudado aqui
        >
          {filterOptions.date.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


export function ScheduleStatusFilter({ statusFilter, handleStatusFilterChange }: scheduleStatusFilterProps) {
  return <div className="relative mb-4 w-full">
  <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
    <LayoutList className="w-5 h-5 text-amber-500" />
    <select
      value={statusFilter}
      onChange={(e) => handleStatusFilterChange(e.target.value as StatusFilterOption)}
      className="w-full bg-white text-gray-900 text-sm focus:outline-none cursor-pointer"
    >
      <option value="all">Todos os status</option>
      <option value="confirmed">Confirmados</option>
      <option value="in-progress">Em andamento</option>
      <option value="canceled">Cancelados</option>
    </select>
  </div>
</div>
}