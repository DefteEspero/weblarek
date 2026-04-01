import './scss/styles.scss';

import { Cart } from './components/Models/Cart.ts';
import { Buyer } from  './components/Models/Buyer.ts';
import { Products } from './components/Models/Products.ts';
import { apiProducts } from './utils/data.ts';
import { WebLarekApi } from "./components/Models/WebLarekApi.ts";
import { API_URL } from './utils/constants.ts';
import { Api } from "./components/base/Api.ts";

const cartTest = new Cart();
const buyerTest = new Buyer();
const productsTest = new Products();
const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];
const api = new Api(API_URL);
const larekApi = new WebLarekApi(api); 

cartTest.addItem(secondProduct);
console.log("Товары в корзине - ", cartTest.getItems());
console.log("Проверка наличия товара в корзине - ", cartTest.inCart(firstProduct.id), " корзина: ", cartTest.getItems());

cartTest.addItem(firstProduct);
console.log("Проверка наличия товара в корзине после добавления - ", cartTest.inCart(firstProduct.id), " корзина: ", cartTest.getItems());
console.log("Количество товаров в корзине - ", cartTest.getItemCount());
console.log("Цена всей корзины - ", cartTest.getTotalPrice());

cartTest.removeItem(firstProduct);
console.log("Количество товаров в корзине после удаления - ", cartTest.getItemCount());
console.log("Цена всей корзины после удаления товара - ", cartTest.getTotalPrice());

cartTest.clearCart();
console.log("Очистка корзины - ", cartTest.getItems());
console.log("Цена корзины после удаления товаров - ", cartTest.getTotalPrice());


productsTest.setItems(apiProducts.items);
console.log('Каталог товаров - ', productsTest.getItems());
console.log("Вывод товаров по id(1й) - ", productsTest.getItemById(firstProduct.id));
console.log("Вывод товаров по id(2й) - ", productsTest.getItemById(secondProduct.id));

productsTest.setPreview(firstProduct);
console.log("Объект товара - ", productsTest.getPreview());


console.log("Данные покупателя до добавления - ", buyerTest.getData());
buyerTest.setData({
    address: "Дворцовая пл., 2, Санкт-Петербург, Россия",
    email: "example@mail.com",
    phone: "+70000000000",
    payment: "online"
});
console.log("Данные покупателя после добавления - ", buyerTest.getData());
buyerTest.setData({
    address: "пл. Комсомольская, 1, Самара, Самарская обл.",
    email: "examplemail@email.ru",
    phone: "+70000000001",
    payment: "offline"
});
console.log("Новые данные покупателя - ", buyerTest.getData());

buyerTest.setData({
    address: "",
    phone: ""
});
console.log("Проверка ошибок валидации c пустыми полями - ", buyerTest.validate());

buyerTest.clearData();
console.log("Очистка данных - ", buyerTest.getData());
console.log("Ошибки валидации после очистки всех полей данных - ", buyerTest.validate());

larekApi.getProducts().then((response) => {
    productsTest.setItems(response.items);
    console.log("Каталог товаров с сервера: ", productsTest.getItems());
}).catch((error: unknown) => {
    console.error("Ошибка получения каталога: ", error);
});