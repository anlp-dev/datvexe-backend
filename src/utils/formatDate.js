// Cách 1: Sử dụng Intl.DateTimeFormat (Không cần thư viện ngoài)
function formatDateTime(date, locale = 'en-GB') {
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(date);
}

// Cách 2: Format theo ISO (YYYY-MM-DD HH:mm:ss)
function formatDateTimeISO(date) {
    return date.toISOString().replace('T', ' ').slice(0, 19);
}

// Xuất các hàm
module.exports = { formatDateTime, formatDateTimeISO };
