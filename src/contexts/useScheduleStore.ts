import { Schedule } from 'src/types/Schedule';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ScheduleState {
    schedules: Schedule[];
    selectedSchedule: Schedule | null;
    setSchedules: (list: Schedule[]) => void;
    addSchedule: (Schedule: Schedule) => void; // Nova função para adicionar um item
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set) => ({
            schedules: [],
            selectedSchedule: null,
            setSchedules: (list: Schedule[]) => set(() => ({ schedules: list })), // Corrigido para atualizar 'Schedules'
            addSchedule: (Schedule: Schedule) => set((state) => ({ schedules: [...state.schedules, Schedule] })), // Adiciona um novo Schedule à lista
        }),
        {
            name: 'Schedule',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
