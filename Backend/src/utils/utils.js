function valueInCents(value) {
    let removeSimbols = value.split("R$", 2)[1];

    let removePoint = removeSimbols.replace(".", "");

    let replaceForPoint = removePoint.replace(",", ".");

    let valueConverted = parseInt(parseFloat(replaceForPoint) * 100);

    return valueConverted;
};

exports.module = {
    valueInCents
}


