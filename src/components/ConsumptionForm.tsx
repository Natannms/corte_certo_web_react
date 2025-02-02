import { useState } from "react"
import { useHairCutStore, useProductStore, useScheduleStore, useUserStore } from "../contexts"
import { toast } from "react-toastify"
import { Consumption } from "../types/Consumption"
import { HairCut } from "../types/Haircut"
import { Product } from "../types/Product"
import { getSchedules } from "../api/api"
import { Schedule } from "../types/Schedule"
type Props ={
    createConsumption:(consumption: Partial<Consumption>)=> void
}
const ConsumptionForm = ({createConsumption}: Props) => {
    const { token } = useUserStore()
    const { selectedSchedule, setSchedules, setSchedule } = useScheduleStore()
    const { haircuts, selectedHairCut, setSelectedHairCut } = useHairCutStore()
    const { products, selectedProduct, setSelectedProduct } = useProductStore()
    const [isLoadingHaircut, setIsLoadingHaircut] = useState(false)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAddHaircut = async () => {
        if (!selectedHairCut?.id) {
            toast('Selecione um corte ou serviço', {type: 'warning', autoClose: 2000})
            return
        }

        setIsLoadingHaircut(true)
        const consumption: Partial<Consumption> = {
            scheduleId: selectedSchedule!.id,
            hairCutId: selectedHairCut.id
        }

        await createConsumption(consumption)
        setSelectedHairCut(null)
        setIsLoadingHaircut(false)
        updateSchedules()
    }

    const handleAddProduct = async () => {
        if (!selectedProduct?.id) {
            toast('Selecione um produto', {type: 'warning', autoClose: 2000})
            return
        }

        if (quantity < 1) {
            toast('Quantidade deve ser maior que zero', {type: 'warning', autoClose: 2000})
            return
        }

        setIsLoadingProduct(true)
        const consumption: Partial<Consumption> = {
            scheduleId: selectedSchedule!.id,
            productId: selectedProduct.id,
            quantity: quantity
        }

        await createConsumption(consumption)
        setSelectedProduct(null)
        setQuantity(1)
        setIsLoadingProduct(false)
        updateSchedules()
    }

    const updateSchedules = async ()=>{
        
        // Carregar Schedules
        const scheduleResult = await getSchedules(token);
        if (scheduleResult.error) {
            toast(scheduleResult.error, {type:"error"});
            return;
        }
        setSchedules(scheduleResult.data);
        const selected =  scheduleResult.data.filter((item:Schedule)=> item.id === selectedSchedule!.id)
        if(selected.length <= 0){
            toast("Houve um erro ao atualizar a lista de agendamentos atualize a pagina!")
            return
        }

        setSchedule(selected[0])

    }

    function handleSelectHairCut(haircutId: string) {
        const id = Number(haircutId)
        if (id === 0) {
            setSelectedHairCut(null)
        } else {
            const selected = haircuts.find((haircut: HairCut) => haircut.id === id)
            setSelectedHairCut(selected || null)
        }
    }

    function handleSelecProduct(productId: string) {
        const id = Number(productId)
        if (id === 0) {
            setSelectedProduct(null)
        } else {
            const selected = products.find((product: Product) => product.id === id)
            setSelectedProduct(selected || null)
        }
    }

    return (
        <div className="space-y-4">
            {haircuts.length > 0 && (
                <div className="form-field">
                    <label className="form-label">Cortes e serviços</label>
                    <div className="flex gap-2">
                        <select
                            disabled={isLoadingHaircut}
                            name="haircut"
                            className="select flex-1"
                            value={selectedHairCut?.id || 0}
                            onChange={(e) => handleSelectHairCut(e.target.value)}
                        >
                            <option value="0">Selecione um corte ou serviço</option>
                            {haircuts.map((haircut) => (
                                <option key={haircut.id} value={haircut.id}>
                                    {haircut.name} - R$ {haircut.price.toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddHaircut}
                            disabled={isLoadingHaircut || !selectedHairCut}
                            className="btn btn-circle btn-primary"
                            type="button"
                        >
                            {isLoadingHaircut ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "+"
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {products.length > 0 && (
                <div className="form-field">
                    <label className="form-label">Produtos</label>
                    <div className="flex gap-2 items-start">
                        <div className="flex-1">
                            <select
                                disabled={isLoadingProduct}
                                name="product"
                                className="select w-full"
                                value={selectedProduct?.id || 0}
                                onChange={(e) => handleSelecProduct(e.target.value)}
                            >
                                <option value="0">Selecione produto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - R$ {product.price.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-20">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="input input-bordered w-full"
                                placeholder="Qtd"
                                disabled={isLoadingProduct || !selectedProduct}
                            />
                        </div>
                        <button 
                            onClick={handleAddProduct}
                            disabled={isLoadingProduct || !selectedProduct}
                            className="btn btn-circle btn-primary"
                            type="button"
                        >
                            {isLoadingProduct ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "+"
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex">
                <label htmlFor="modal-consumption" className="btn btn-block">
                    Fechar
                </label>
            </div>
        </div>
    );
}

export default ConsumptionForm;