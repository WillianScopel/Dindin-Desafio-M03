export function correctDate(date) {
    const newDate = new Date(date).toLocaleDateString("pt-BR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Sao_Paulo",
    });
    return newDate
}

export function getWeekday(date) {
    const newDate = new Date(date).toLocaleDateString("pt-BR", {
        weekday: "long",
        timeZone: "America/Sao_Paulo",
    });

    return newDate.charAt(0).toUpperCase() + newDate.slice(1).split('-')[0]
}

export function correctValue(value) {
    let valueInBrl = (value / 100);

    return valueInBrl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function balanceCalc(credit, debit) {
    return Number(credit) - Number(debit)
}

export function firstName(name) {
    return name.split(" ")[0]
}

export function orderByDateAsc(array) {
    return array.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
}

export function orderByDateDesc(array) {
    return array.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}


