import { Schedule } from 'src/types/Schedule';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ScheduleState {
    schedules: Schedule[];
    selectedSchedule: Schedule | null;
    setSchedule: (schedule: Schedule) => void;
    setSchedules: (list: Schedule[]) => void;
    addSchedule: (Schedule: Schedule) => void; // Nova função para adicionar um item
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set) => ({
            schedules: [],
            selectedSchedule: null,
            setSchedule: (schedule: Schedule) => set(() => ({ selectedSchedule: schedule })), 
            setSchedules: (list: Schedule[]) => set(() => ({ schedules: list })), 
            addSchedule: (Schedule: Schedule) => set((state) => ({ schedules: [...state.schedules, Schedule] })), 
        }),
        {
            name: 'Schedule',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
