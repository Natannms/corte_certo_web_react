function ToBRL(valor:number) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
const formatToBrazilTime = (utcDate: string): string => {
    const date = new Date(utcDate);
    date.setHours(date.getHours());
    return date.toISOString().slice(11, 16);
};

export {ToBRL, formatToBrazilTime}