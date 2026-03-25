const validatePayload = (payload, isUpdate) => {
    const { name, image, price, quantity } = payload;
    const errors = [];

    if (!name) {
        errors.push("Tên sản phẩm không được để trống");
    }

    if (!image && !isUpdate) {
        errors.push("Hình ảnh không được để trống");
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        errors.push("Giá không hợp lệ");
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
        errors.push("Số lượng không hợp lệ");
    }

    if (errors?.length > 0) {
        return errors;
    }

    return null;
}

module.exports = { validatePayload };
