function plural (n, singularNominativ, pluralNominativ, pluralGenitive = pluralNominativ) {
    n = Math.abs(parseInt(n, 10));

    if (n === 1) {
        return singularNominativ;
    }
    else if (/([^1]|^)[2-4]$/.test(n.toString().substr(-2))) {
        return pluralNominativ;
    }
    
    return pluralGenitive;
};

export default plural;