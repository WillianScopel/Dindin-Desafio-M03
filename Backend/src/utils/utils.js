const valueInCents = (value) => {
    return parseInt(parseFloat(value.split("R$", 2)[0].replace(".", "").replace(",", ".")))
}

module.exports = valueInCents



