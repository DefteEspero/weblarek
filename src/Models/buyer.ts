import { buyerData, buyerError } from "../types/index.ts";

export class buyer {
    private payment: buyerData['payment'] | '' = '';
    private address = '';
    private phone = '';
    private email = '';

    getData(): Partial<buyerData> {
        return {
            payment: this.payment || undefined,
            email: this.email,
            phone: this.phone,
            address: this.address
        }
    }

    setData(data: Partial<buyerData>): void {

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

    clear(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validate(): buyerError {
        const errors: buyerError = {};
        
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
            errors.payment = "Спопосб оплаты не выбран, выберите способ оплаты."
        }

        return errors;
    }
}