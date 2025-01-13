
import { z } from 'zod';

// Esquema de validação usando Zod
export const formSchema = z.object({
    date: z.string().nonempty("A data é obrigatória"),
    time: z.string().nonempty("O horário é obrigatório"),
    // barber: z.string().nonempty("O barbeiro é obrigatório"),
    hairCut: z.string().nonempty("O corte de cabelo é obrigatório")
});

export const scheduleFormValidate = (formValues:any)=>{
    try {
        formSchema.parse(formValues);
        return formValues;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Erros de validação:", error.errors);
            return {error: error.errors}
        }
    }
}


