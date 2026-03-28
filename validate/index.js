const validatePayload = (payload, isUpdate) => {
    const { name, image, price, quantity, type } = payload;
    const errors = [];
    const validTypes = ["AAA", "BBB", "CCC"];

    if (!name) {
        errors.push("Tên sản phẩm không được để trống");
    }

    if (!image && !isUpdate) {
        errors.push("Hình ảnh không được để trống");
    }

    if (!type || !validTypes.includes(type)) {
        errors.push("Loại sản phẩm không hợp lệ");
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        errors.push("Giá không hợp lệ");
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
        errors.push("Số lượng không hợp lệ");
    }

    if (errors.length > 0) {
        return errors;
    }

    return null;
}

module.exports = { validatePayload };
