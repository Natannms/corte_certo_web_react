import { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  XCircle,
  Clock,
  Calendar,
  User
} from "lucide-react";
import { useScheduleStore } from "../contexts/useScheduleStore";
import { formatToBrazilTime } from "../utils/convert";
import {
  DateFilterOption,
  StatusFilterOption,
  filterSchedules,
  getFilterLabels
} from '../utils/scheduleFilters';
import { ScheduleDateFilter, ScheduleStatusFilter } from './ScheduleDateFilter';
import { ScheduleButton } from './ScheduleButton';
import { Schedule } from 'src/types/Schedule';
import { ModalComponent } from './ModalComponent';

type Props = {
  updateScheduleStatus: (id: number, token: string) => void;
}

export default function ScheduleSliderMobile({ updateScheduleStatus }: Props) {
  const { schedules, setSchedule, selectedSchedule } = useScheduleStore();
  const [filters, setFilters] = useState({
    dateFilter: 'thisWeek' as DateFilterOption,
    statusFilter: 'all' as StatusFilterOption
  });

  const filteredSchedules = useMemo(() => {
    return filterSchedules(schedules, filters);
  }, [schedules, filters]);

  const filterLabel = useMemo(() => {
    return getFilterLabels(filters);
  }, [filters]);

  function handleDateFilterChange(dateFilter: DateFilterOption) {
    setFilters(prev => ({ ...prev, dateFilter }));
  }

  function handleStatusFilterChange(statusFilter: StatusFilterOption) {
    setFilters(prev => ({ ...prev, statusFilter }));
  }

  if (!schedules) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <p className="text-gray-500">Carregando agendamentos...</p>
      </div>
    );
  }

  function getScheduleStatusBadge(status: string) {
    const statusStyles = {
      'canceled': 'text-red-500',
      'confirmed': 'text-indigo-500',
      'in-progress': 'text-emerald-500'
    } as const;

    const statusClass = statusStyles[status as keyof typeof statusStyles] || '';

    return (
      <div className={`inline-block px-2 py-0.5 rounded-full backdrop-blur-sm bg-white ${statusClass}`}>
        <p className="text-sm font-medium">
          {status.toUpperCase()}
        </p>
      </div>
    );
  }

  function handleSelectSchedule(schedule: Schedule) {
    setSchedule(schedule)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        <ScheduleDateFilter
          currentFilter={filters.dateFilter}
          onFilterChange={handleDateFilterChange}
        />

        <ScheduleStatusFilter
          handleStatusFilterChange={handleStatusFilterChange}
          statusFilter={filters.statusFilter}
        />
      </div>

      {/* Label do filtro atual */}
      <div className="mb-4 text-sm text-gray-100">
        {filterLabel}
      </div>

      {/* Navegação do Swiper */}
      <button
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2 hover:bg-gray-50 transition-all duration-300 active:scale-95"
        id="prev-btn"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: "#prev-btn",
          nextEl: "#next-btn",
        }}
        spaceBetween={16}
        slidesPerView={1}
        className="w-full"
      >
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule: Schedule) => (
            <SwiperSlide key={schedule.id}>
              <div className="rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-amber-100 to-amber-500">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-1.5">
                      {schedule.client ? (
                        <h3 className="text-lg font-semibold text-black">
                          {schedule.client.name}
                        </h3>
                      ) : (
                        <div className="inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                          <p className="text-sm font-medium text-black">
                            SCL#{schedule.id}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-black/90">
                          <Calendar className="w-4 h-4" />
                          <p className="text-sm">
                            {new Date(schedule.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-black/90">
                          <Clock className="w-4 h-4" />
                          <p className="text-sm">
                            {formatToBrazilTime(new Date(schedule.time).toString())}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-black/90">
                          {getScheduleStatusBadge(schedule.status)}
                        </div>
                        <div className="flex items-center gap-2 text-black/90">
                          <User className="w-4 h-4" />
                          <p className="text-sm">
                            {schedule.user?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      {schedule.status === 'confirmed' && (
                        <>
                          <ScheduleButton
                            scheduleId={schedule.id}
                            newStatus="in-progress"
                            onUpdateStatus={updateScheduleStatus}
                          >
                            <PlayCircle className="w-5 h-5" />
                            <span className="text-sm md:font-medium">
                              Iniciar Atendimento
                            </span>
                          </ScheduleButton>
                          <label
                            className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center gap-2 text-white py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 hover:shadow-lg"
                            htmlFor='modal-consumption'
                            onClick={()=> handleSelectSchedule(schedule)}

                          >
                           <PlayCircle className="w-5 h-5" />
                            <span className="text-sm md:font-medium">
                              Visualizar consumo
                            </span>
                          </label>

                          <ScheduleButton
                            scheduleId={schedule.id}
                            newStatus="canceled"
                            variant="danger"
                            onUpdateStatus={updateScheduleStatus}
                          >
                            <XCircle className="w-5 h-5" />
                            <span className="text-sm md:font-medium">
                              Cancelar Agendamento
                            </span>
                          </ScheduleButton>
                        </>
                      )}

                      {schedule.status === 'in-progress' && (
                        <div className='z-50 relative'>
                          <label className="btn btn-primary" htmlFor="modal-consumption" onClick={() => setSchedule(schedule)}>Adicionar consumo</label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 flex items-center justify-center min-h-[300px] bg-white">
                <p className="text-gray-500">
                  {filters.dateFilter === 'all' && filters.statusFilter === 'all'
                    ? 'Nenhum agendamento disponível'
                    : 'Nenhum agendamento encontrado para os filtros selecionados'
                  }
                </p>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Botão Próximo */}
      <button
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2 hover:bg-gray-50 transition-all duration-300 active:scale-95"
        id="next-btn"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
      <ModalComponent htmlFor='modal-consumption' schedule={selectedSchedule!} />

    </div>
  );
}