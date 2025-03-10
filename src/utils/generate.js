const generateTicketCode = () => {
    const prefix = "SVBK";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";

    for (let i = 0; i < 9; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${prefix}${randomPart}`;
};

module.exports = generateTicketCode;
