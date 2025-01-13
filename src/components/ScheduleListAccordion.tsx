import React from 'react';
import { Calendar, ChevronDown, ArrowLeftCircle, ArrowRightCircle, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Schedule } from 'src/types/Schedule';
import { formatToBrazilTime } from '../utils/convert';



type Props = {
    schedules: Schedule[];
    rangePage: [number, number];
    nextSchedule: () => void;
    previusSchedule: () => void;
};

const getScheduleStatus = (status: string): {icon: JSX.Element, class:string} => {
    const statusConfig:any = {
        'confirmed': {
            icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
            class: 'bg-emerald-500/10 text-emerald-500'
        },
        'canceled': {
            icon: <XCircle className="w-4 h-4 text-red-500" />,
            class: 'bg-red-500/10 text-red-500'
        },
        'in-progress': {
            icon: <Clock className="w-4 h-4 text-amber-500" />,
            class: 'bg-amber-500/10 text-amber-500'
        },
        'default': {
            icon: <AlertCircle className="w-4 h-4 text-gray-500" />,
            class: 'bg-gray-500/10 text-gray-500'
        }
    };

    return statusConfig[status] || statusConfig.default;
};

export default function ScheduleListAccordion({ schedules, rangePage, nextSchedule, previusSchedule }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-gray-700 font-medium">Detalhes rápidos de agendamento</span>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                <div className={`transition-all duration-300 ease-in-out ${isOpen
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                    <div className="bg-amber-500 p-4">
                        <ul className="space-y-3">
                            {schedules.length > 0 ? (
                                schedules
                                    .slice(rangePage[0], rangePage[1])
                                    .map((schedule) => {
                                        const status = getScheduleStatus(schedule.status);

                                        return (
                                            <li
                                                key={schedule.id}
                                                className="flex items-center justify-between p-3 flex-wrap rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
                                            >
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.class}`}>
                                                    {status.icon}
                                                    {/* <span>{schedule.status}</span> */}
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <span className="text-sm">{schedule.client ? schedule.client.name : `SCL# ${schedule.id}`}</span>
                                                </div>
                                               
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <span className="text-sm">{new Date(schedule.time).toLocaleDateString()}</span>
                                                    <span className="text-sm"> {formatToBrazilTime(new Date(schedule.time).toString())}</span>

                                                </div>

                                                <button className="p-2 rounded-lg bg-gray-800 hover:bg-amber-500 transition-colors duration-200 group">
                                                    <Calendar className="w-5 h-5 text-blue-500 group-hover:text-white" />
                                                </button>
                                            </li>
                                        );
                                    })
                            ) : (
                                <li className="text-center text-gray-300 py-4">
                                    Nenhum agendamento disponível
                                </li>
                            )}
                        </ul>

                        {schedules.length > 0 && (
                            <div className="flex items-center justify-center gap-8 mt-6">
                                <button
                                    onClick={previusSchedule}
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <ArrowLeftCircle className="w-6 h-6 text-gray-400" />
                                </button>
                                <button
                                    onClick={nextSchedule}
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <ArrowRightCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}