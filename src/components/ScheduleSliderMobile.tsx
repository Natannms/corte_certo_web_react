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
import { DateFilterOption, filterSchedulesByDate } from '../utils/dateFilters';
import ScheduleDateFilter from './ScheduleDateFilter';

type Props = {
  updateScheduleStatus: (id: number, token: string) => void;
}

export default function ScheduleSliderMobile({ updateScheduleStatus }: Props) {
  const { schedules } = useScheduleStore();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('thisWeek');

  const filteredSchedules = useMemo(() => {
    return filterSchedulesByDate(schedules, dateFilter);
  }, [schedules, dateFilter]);

  if (!schedules) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <p className="text-gray-500">Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Filtro de Data */}
      <ScheduleDateFilter
        currentFilter={dateFilter}
        onFilterChange={setDateFilter}
      />

      {/* Botão Anterior */}
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
          filteredSchedules.map((schedule) => (
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
                          <div className="inline-block px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">
                            <p className="text-sm font-medium text-black">
                              {schedule.status}
                            </p>
                          </div>
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
                        <button
                          onClick={() => updateScheduleStatus(schedule.id, 'in-progress')}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 hover:shadow-lg"
                        >
                          <PlayCircle className="w-5 h-5" />
                          <span className="text-sm md:font-medium">Iniciar Atendimento</span>
                        </button>
                      )}
                      <button
                        onClick={() => updateScheduleStatus(schedule.id, 'canceled')}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 hover:shadow-lg"
                      >
                        <XCircle className="w-5 h-5" />
                        <span className="text-sm md:font-medium">Cancelar Agendamento</span>
                      </button>
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
                  {dateFilter === 'all' 
                    ? 'Nenhum agendamento disponível'
                    : 'Nenhum agendamento encontrado para o período selecionado'
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
    </div>
  );
}