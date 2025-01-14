import { useUserStore, useHairCutStore, useBarberShopStore } from '../contexts';
import React, { useState } from 'react';
import { createSchedule, getAvailableDates } from '../../src/api/api';
import { UnscheduledBarbers } from '../../src/types/Paginated';
import { scheduleFormValidate } from '../../src/validations/validations';
import { toast } from 'react-toastify';
type Props ={
    loadingData: ()=> void
}
const NewScheduleForm = ({loadingData}:Props) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [unscheduledBarbers, setUnscheduledBarbers] = useState<UnscheduledBarbers[]>([]);
    const [ defaultAttendant, setDefaultAttendant] = useState<number>(0)
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedBarber, setSelectedBarber] = useState(0);
    const [selectedHaircut, setSelectedHaircut] = useState(0);
    const [selectedBarberShop, setSelectedBarberShop] = useState(0);
    const { token } = useUserStore();
    const { barberShops } = useBarberShopStore();
    const { haircuts } = useHairCutStore()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        try {
            const barberShopId = barberShops.length > 1 ? selectedBarberShop : barberShops[0].id
            if(!barberShopId){
                toast("Unidade não selecionada")
                return
            }

            const data = await getAvailableDates(token, barberShopId);
            if(data.error){
                setAvailableTimes([])
                setUnscheduledBarbers([])
                throw new Error(data.error);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
            console.log(defaultAttendant);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
            setAvailableTimes(data.availableTimes);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
            if(data.defaultAttendant){
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setDefaultAttendant(data.defaultAttendant!)
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setUnscheduledBarbers(data.unscheduledBarbersList!);
        } catch (error) {
            toast((error as Error).message, {type:"error"})
        }
    };

    const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita o reload da página ao submeter o formulário
        setIsLoading(true)
        const formElement = e.currentTarget;

        const formData = new FormData(e.currentTarget);
        // Convertendo FormData para objeto
        const formValues = {
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            barber: formData.get('barber') as string,
            hairCut: formData.get('haircut') as string,
            phone: formData.get('phone') as string,
            barberShopId: formData.get('barberShopId') as string
        };

        const err = scheduleFormValidate(formValues)
        if (err.error) {
            toast("Dádos inválidos. verifique os campos novamente")
            setIsLoading(false)
            return
        }

        const result = await createSchedule(formValues, token)
        if (result.error) {
            toast(result.error)
            setIsLoading(false)
            return
        }

        toast(result.message)
        // Limpa o formulário
        formElement.reset();
        // Opcional: redefine o estado manualmente, se necessário
        setSelectedDate('');
        setSelectedTime('');
        setSelectedBarber(0);
        setAvailableTimes([]);
        setUnscheduledBarbers([]);
        setIsLoading(false)
       await loadingData()
    };

    return (
        <form onSubmit={onsubmit} className="flex flex-col gap-4 w-full">
          
            {barberShops &&(
                <div className="form-field">
                <label className="form-label">Barbearias Disponíveis</label>
                <div className="text-sm text-gray-400">
                    unidade(s) disponível(is)
                </div>
                <div className="form-control">
                    <select
                        disabled={isLoading}
                        name="barberShopId"
                        className="select max-w-full"
                        value={barberShops.length > 1 ? selectedBarberShop : barberShops[0].id}
                        onChange={(e) => setSelectedBarberShop(Number(e.target.value))}
                    >
                         
                        {barberShops.length > 1 &&   <option value="">Selecione um a unidade</option>}
                        {barberShops.length > 1 ?
                            barberShops.map((barberShop) => (
                                <option key={barberShop.id} value={barberShop.id}>
                                    {barberShop.name}
                                </option>
                            )) : 
                            <option selected value={barberShops[0].id} key={barberShops[0].id}>{barberShops[0].name}</option>
                        }
                    </select>
                </div>
            </div>
            )}
             <div className="form-field">
                <label className="form-label">Data do Agendamento</label>
                <div className="form-control relative">
                    <input
                        type="date"
                        name="date"
                        placeholder="Selecione uma data"
                        className="input max-w-full"
                        value={selectedDate}
                        onChange={handleDateChange}
                        disabled={isLoading}
                    />
                </div>
            </div>
            {availableTimes.length > 0 && selectedDate && (
                <div className="form-field">
                    <label className="form-label">Horário Disponível</label>
                    <div className="form-control">
                        <select
                            disabled={isLoading}
                            name="time"
                            className="select max-w-full"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="">Selecione um horário</option>
                            {availableTimes.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
             {haircuts.length > 0 && selectedTime && selectedDate && (
                <div className="form-field">
                    <label className="form-label">Cortes e serviços</label>
                    <div className="form-control">
                        <select
                            disabled={isLoading}
                            name="haircut"
                            className="select max-w-full"
                            value={selectedHaircut}
                            onChange={(e) => setSelectedHaircut(Number(e.target.value))}
                        >
                            <option value="">Selecione um corte ou serviço</option>
                            {haircuts.map((haircuts) => (
                                <option key={haircuts.id} value={haircuts.id}>
                                    {haircuts.name} - {haircuts.price}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
             
            
            {unscheduledBarbers && unscheduledBarbers.length > 0 &&(
                <div className="form-field">
                    <label className="form-label">Barbeiros Disponíveis</label>
                    <div className="text-sm text-gray-400">
                        barbeiro(s) disponível(is)
                    </div>
                    <div className="form-control">
                        <select
                            disabled={isLoading}
                            name="barber"
                            className="select max-w-full"
                            value={selectedBarber}
                            onChange={(e) => setSelectedBarber(Number(e.target.value))}
                        >
                            <option value="">Selecione um barbeiro</option>
                            {unscheduledBarbers.map((barber) => (
                                <option key={barber.id} value={barber.id}>
                                    {barber.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="form-field">
                <label className="form-label">Confirmar cliente</label>
                <input
                    name='phone'
                    className="input"
                    placeholder="Digite o numero de telefone"
                    disabled={isLoading}
                />
                <small className='text-gray-500'>Adicione o numero do whatsapp ⚠️</small>
            </div>

            <button type="submit" className="btn btn-primary">
                {isLoading ?
                    <svg className="spinner-ring spinner-warning" viewBox="25 25 50 50" strokeWidth="5">
                        <circle cx="50" cy="50" r="20" />
                    </svg>
                    :
                    'Agendar'
                }
            </button>
        </form>
    );
};

export default NewScheduleForm;
