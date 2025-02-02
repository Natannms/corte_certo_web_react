import { Consumption } from '../../src/types/Consumption';
import { useUserStore, useScheduleStore } from '../contexts';
import { Schedule } from '../types/Schedule';
import ConsumptionForm from './ConsumptionForm';
import { createConsumption, getSchedules, deleteConsumption as deleteItemToConsumption} from '../../src/api/api';
import { toast } from 'react-toastify';

interface ModalBaseProps {
  htmlFor: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

interface ModalConsumptionProps extends ModalBaseProps {
  schedule: Schedule;
}

interface ModalCancelProps extends ModalBaseProps {
  schedule: Schedule;
  onCancelSchedule: (scheduleId: number) => void;
}

type ModalProps = ModalConsumptionProps | ModalCancelProps;

const maxWidthClasses = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  'full': 'max-w-full'
} as const;

export function ModalComponent(props: ModalProps) {
  const { htmlFor, maxWidth = '3xl' } = props;

  function getModalContent() {
    switch (htmlFor) {
      case 'modal-consumption':
        return <ConsumptionModalContent />;

      case 'modal-cancel':
        return <CancelModalContent {...props as ModalCancelProps} />;

      default:
        console.warn(`Modal type not found for htmlFor: ${htmlFor}`);
        return null;
    }
  }

  return (
    <>
      <input className="modal-state" id={htmlFor} type="checkbox" />
      <div className="modal w-screen">
        <label className="modal-overlay" htmlFor={htmlFor}></label>
        <div className={`modal-content flex flex-col gap-5 ${maxWidthClasses[maxWidth]}`}>
          <label
            htmlFor={htmlFor}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          {getModalContent()}
        </div>
      </div>
    </>
  );
}

function ConsumptionModalContent() {
  const { token } = useUserStore()
  const { setSchedules, selectedSchedule, setSchedule } = useScheduleStore() // Adicione setSelectedSchedule

  const deleteConsumption = async (consumptionId: number) => {
    await deleteItemToConsumption(consumptionId, token)
    // Atualiza localmente e no servidor
    if (selectedSchedule) {
      const updatedConsumptions = selectedSchedule.consumptions.filter(c => c.id !== consumptionId)
      setSchedule({
        ...selectedSchedule,
        consumptions: updatedConsumptions
      })
    }
    updateSchedule()
  }

  const calculateTotal = () => {
    if (!selectedSchedule?.consumptions) return 0
    
    return selectedSchedule.consumptions.reduce((total, consumption:any) => {
      if (consumption.product) {
        return total + (consumption.product.price * (consumption.quantity || 1))
      }
      if (consumption.hairCut) {
        return total + consumption.hairCut.price
      }
      return total
    }, 0)
  }

  async function updateSchedule() {
    const scheduleResult = await getSchedules(token);
    if (scheduleResult.error) {
      toast("Erro ao atualizar agendamentos. para isso sua tela será recarregada", { type: 'error' });
      window.location.href = '/dashboard'
      return;
    }
    setSchedules(scheduleResult.data);
    toast("Agendamento atualizado", { type: 'success' });
  }

  const createNewConsumption = async (consumption: Partial<Consumption>) => {
    const result = await createConsumption(consumption, token)
    if (result.error) {
      toast(result.error, { type: 'error' })
      return
    }

    // Atualiza schedules e consequentemente o selectedSchedule
    const scheduleResult = await getSchedules(token);
    if (scheduleResult.error) {
      toast("Erro ao atualizar agendamentos. Para isso sua tela será recarregada", { type: 'error' });
      window.location.href = '/dashboard'
      return;
    }

    // Garante que scheduleResult.data é um array de Schedule
    const schedules = scheduleResult.data as Schedule[];

    // Encontra o schedule atualizado
    const updatedSchedule = schedules.find(
      (schedule) => schedule.id === selectedSchedule?.id
    );

    if (!updatedSchedule) {
      toast("Erro ao atualizar consumo", { type: 'error' });
      return;
    }

    // Atualiza os schedules garantindo que não há undefined
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id === selectedSchedule?.id) {
          return updatedSchedule;
        }
        return schedule;
      })
    );

    toast(result.message, { type: 'success' })
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Informações</h2>
      <div className="max-h-64 overflow-y-auto mb-4 pr-2">
        <div className="grid gap-3">
          {selectedSchedule?.consumptions.map((consumption:any) => (
            <div
              key={consumption.id}
              className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  {consumption.product && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {consumption.product.name}
                          <span className="ml-2 text-gray-500">
                            ({consumption.quantity}x)
                          </span>
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {consumption.product.description}
                      </p>
                      <div className="flex flex-col justify-between ">
                        <span className="text-gray-500 text-xs">
                          Valor unitário: R$ {consumption.product.price.toFixed(2)}
                        </span>
                        <span className="text-green-600 font-bold">
                          Total: R$ {(consumption.product.price * (consumption.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {consumption.hairCut && (
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">
                            {consumption.hairCut.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {consumption.hairCut.description}
                          </p>
                        </div>
                        <span className="text-green-600 font-medium text-sm ml-2">
                          R$ {consumption.hairCut.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => deleteConsumption(consumption.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="text-xs text-gray-400">
                {new Date(consumption.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg mb-4">
        <span className="font-medium text-gray-700">Total do Agendamento</span>
        <span className="text-lg font-semibold text-green-600">
          R$ {calculateTotal().toFixed(2)}
        </span>
      </div>

      <ConsumptionForm createConsumption={createNewConsumption} />
    </>
  );
}

function CancelModalContent({ schedule, onCancelSchedule }: ModalCancelProps) {
  const handleCancel = () => {
    onCancelSchedule(schedule.id);

    // Fecha o modal
    const modalCheckbox = document.getElementById('modal-cancel') as HTMLInputElement;
    if (modalCheckbox) modalCheckbox.checked = false;
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-red-600">Confirmar Cancelamento</h2>
      <p className="text-gray-600">
        Tem certeza que deseja cancelar o agendamento #{schedule.id}?
        Esta ação não pode ser desfeita.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="btn btn-error btn-block"
        >
          Confirmar Cancelamento
        </button>
        <label htmlFor="modal-cancel" className="btn btn-block">
          Voltar
        </label>
      </div>
    </>
  );
}