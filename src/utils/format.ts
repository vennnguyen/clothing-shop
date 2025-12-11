export function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false
    });
}

export function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh"
    });
}

export function formatMoney(amount) {
    if (amount == null) return "0 ₫";

    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    });
}

export function formatPhone(phone = "") {
    if (!phone) return "";

    // Bỏ khoảng trắng, ký tự đặc biệt
    let cleaned = phone.replace(/\D/g, "");

    // Nếu bắt đầu bằng 84 → chuyển thành 0
    if (cleaned.startsWith("84")) {
        cleaned = "0" + cleaned.slice(2);
    }

    // Format: 4 - 3 - 3
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
}
