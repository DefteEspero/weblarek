import { BuyerData, BuyerError } from "../../types/index.ts";

export class Buyer {
    private payment: BuyerData['payment'] | '' = '';
    private address = '';
    private phone = '';
    private email = '';

    getData(): BuyerData {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    setData(data: Partial<BuyerData>): void {

        if (data.payment !== undefined) {
            this.payment = data.payment;
        }

        if (data.email !== undefined) {
            this.email = data.email;
        }

        if (data.address !== undefined) {
            this.address = data.address;
        }

        if (data.phone !== undefined) {
            this.phone = data.phone;
        }

    }

    clearData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validate(): BuyerError {
        const errors: BuyerError = {};
        
        if (!this.email.trim()) {
            errors.email = "Пустое поле, укажите ваш e-mail.";
        }

        if (!this.address.trim()) {
            errors.address = "Пустое поле, укажите адрес.";
        }

        if (!this.phone.trim()) {
            errors.phone = "Пустое поле, укажите ваш номер телефона.";
        }

        if (!this.payment) {
            errors.payment = "Способ оплаты не выбран, выберите способ оплаты."
        }

        return errors;
    }
}