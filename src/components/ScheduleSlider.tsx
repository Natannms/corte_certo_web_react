import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Schedule } from 'src/types/Schedule';
import { useScheduleStore } from "../contexts/useScheduleStore";

interface User {
  id: number;
  type: string;
  name: string;
  phone: string;
  email: string;
}

interface Client {
  id: number;
  name: string;
}

interface Consumption {
  id: number;
  name: string;
  price: number;
}

const ScheduleSlider: React.FC = () => {
    const {schedules } = useScheduleStore()

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  if (!schedules || schedules.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Nenhum agendamento disponível</p>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error(e) 
      return '--:--';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    } catch (e) {
      console.error(e) 
      return '--/--';
    }
  };

  const getStatusColor = (status: Schedule['status']): string => {
    const statusColors: Record<Schedule['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        return prevIndex === schedules.length - 1 ? 0 : prevIndex + 1;
      } else {
        const maxIndex = schedules.length - 3;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        return prevIndex === 0 ? schedules.length - 1 : prevIndex - 1;
      } else {
        const maxIndex = schedules.length - 3;
        return prevIndex === 0 ? maxIndex : prevIndex - 1;
      }
    });
  };

  const getSlideWidth = (): string => {
    return isMobile ? '100%' : '33.333%';
  };

  const getTransformValue = () => {
    const basePercentage = isMobile ? 100 : (100 / 3);
    return `translateX(-${currentIndex * basePercentage}%)`;
  };

  const visibleSlidesCount = isMobile ? 1 : 3;
  const shouldShowNavigation = schedules.length > visibleSlidesCount;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Agendamentos</h2>
          {shouldShowNavigation && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{
              transform: getTransformValue(),
              width: `${(schedules.length / (isMobile ? 1 : 3)) * 100}%`
            }}
          >
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                style={{ width: getSlideWidth() }}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-2xl font-bold">{formatTime(schedule.time)}</div>
                    <div className="text-sm text-gray-500">{formatDate(schedule.date.toString())}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Barbeiro:</span>
                    <span className="text-gray-600">NAME TESTE</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Cliente:</span>
                    <span className="text-gray-600">NAO DEFINIDO</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSlider;