import './scss/styles.scss';

import { cart } from "./Models/cart.ts";
import { buyer } from './Models/buyer.ts';
import { products } from './Models/product.ts';
import { apiProducts } from './utils/data.ts';

const cartTest = new cart();
const buyerTest = new buyer();
const productsTest = new products();
const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];


cartTest.addItems(secondProduct);
console.log("Товары в корзине - ", cartTest.getItems());

console.log("Проверка наличия товара в корзине - ", cartTest.inCart(firstProduct.id), " корзина: ", cartTest.getItems());

cartTest.addItems(firstProduct);
console.log("Проверка наличия товара в корзине после добавления - ", cartTest.inCart(firstProduct.id), " корзина: ", cartTest.getItems());

console.log("Количество товаров в корзине - ", cartTest.getItmesCount());

console.log("Цена всей корзины - ", cartTest.getTotalPrice());

cartTest.removeItem(firstProduct);

console.log("Цена всей корзины после удаления товара - ", cartTest.getTotalPrice());
console.log("Количество товаров в корзине после удаления - ", cartTest.getItmesCount());

cartTest.clearCart();
console.log("Отчистка корзины - ", cartTest.getItems());


productsTest.setItems(apiProducts.items);
console.log('Каталог товаров - ', productsTest.getItems());

console.log("Вывод товаров по id(1й) - ", productsTest.getItemsById(firstProduct.id));
console.log("Вывод товаров по id(2й) - ", productsTest.getItemsById(secondProduct.id));

productsTest.setPreview(firstProduct);
console.log("Каталог товаров - ", productsTest.getPreview());


buyerTest.setData({
    address: "Дворцовая пл., 2, Санкт-Петербург, Россия",
    email: "example@hail.com",
    phone: "+70000000000",
    payment: "cash"
})
console.log("Данные покупателя - ", buyerTest.getData());

buyerTest.setData({
    address: "",
    phone: ""
})
console.log("Проверка ошибок валидации c пустыми полями - ", buyerTest.validate());

buyerTest.clear();
console.log("Отчистка данных - ", buyerTest.getData());
console.log("Ошибки валидации после отчистки полей данных - ", buyerTest.validate());

