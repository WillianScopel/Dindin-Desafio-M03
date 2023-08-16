const valueInCents = (value) => {
    return parseInt(parseFloat(value.split("R$", 2)[1].replace(".", "").replace(",", ".")) * 100)
}

module.exports = valueInCents




