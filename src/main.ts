import "./scss/styles.scss";

import { Cart } from "./components/Models/Cart.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { Products } from "./components/Models/Products.ts";
import { WebLarekApi } from "./components/Models/WebLarekApi.ts";
import { API_URL } from "./utils/constants.ts";
import { Api } from "./components/base/Api.ts";
import { EventEmitter, events } from "./components/base/Events.ts";
import { BuyerData, ProductEvent, BuyerError, BuyerPayment, OrderRequest, FormEvent } from "./types/index.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { PreviewCard } from "./components/View/PreviewCard.ts";
import { BuyerCart } from "./components/View/BuyerCart.ts";
import { Modal } from "./components/View/Modal.ts";
import { CatalogCard } from "./components/View/CatalogCard.ts";
import { CartCard } from "./components/View/CartCard.ts";
import { OrderSuccess } from "./components/View/OrderSuccess.ts";
import { OrderForm } from "./components/View/OrderForm.ts";
import { ContactsForm } from "./components/View/ContactsForm.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { Header } from "./components/View/Header.ts";

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);
const eventEmitter = new EventEmitter();
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const header = new Header(ensureElement<HTMLElement>(".header"), eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), eventEmitter);
const products = new Products(eventEmitter);
const cart = new Cart(eventEmitter);
const buyer = new Buyer(eventEmitter);
const getOrderErrors = (errors: BuyerError): string => [errors.payment, errors.address].filter(Boolean).join(" ");
const getContactsErrors = (errors: BuyerError): string => [errors.email, errors.phone].filter(Boolean).join(" ");
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>("#order"), eventEmitter);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>("#contacts"), eventEmitter);
const buyerCart = new BuyerCart(cloneTemplate<HTMLElement>("#basket"), eventEmitter);
const success = new OrderSuccess(cloneTemplate<HTMLElement>("#success"), eventEmitter);

const previewCard = new PreviewCard(cloneTemplate<HTMLElement>("#card-preview"), () => {
    const preview = products.getPreview();

    if (!preview || preview.price === null) {
        return;
    }

    if (cart.inCart(preview.id)) {
      cart.removeItem(preview.id);
    } else {
      cart.addItem(preview);
    }

    modal.close();
});

larekApi.getProducts().then((response) => {
    products.setItems(response.items);
    console.log("Каталог товаров с сервера: ", products.getItems());
})
.catch((error: unknown) => {
    console.error("Ошибка получения каталога: ", error);
});

function renderCatalog(): void {
    const cards = products.getItems().map((item) => {
        const card = new CatalogCard(cloneTemplate<HTMLButtonElement>("#card-catalog"), () => {
            eventEmitter.emit<ProductEvent>(events.productSelect, { id: item.id });
    });

        return card.render(item);
    });

    gallery.render({ items: cards });
}

function renderHeader(): void {
    header.render({ counter: cart.getItemCount() });
}

function renderPreview(): HTMLElement {
    const preview = products.getPreview();

    if (!preview) {
        return previewCard.render();
    }

    const inCart = cart.inCart(preview.id);
    const buttonDisabled = preview.price === null;
    const buttonText = preview.price === null ? "Недоступно" : inCart ? "Удалить из корзины" : "Купить";

    return previewCard.render({
        ...preview,
        buttonText,
        buttonDisabled
    });
}

function renderCart(): HTMLElement {
    const cartItems = cart.getItems().map((item, index) => {
        const cartCard = new CartCard(cloneTemplate<HTMLElement>("#card-basket"), () => {
            cart.removeItem(item.id);
        });

        return cartCard.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    return buyerCart.render({
        items: cartItems,
        total: cart.getTotalPrice(),
        disabled: cart.getItemCount() === 0
    });
}

function renderOrder(): HTMLElement {
    const data = buyer.getData();
    const errors = getOrderErrors(buyer.validate());

    return orderForm.render({
        address: data.address,
        payment: data.payment,
        valid: errors.length === 0,
        errors,
    });
}

function renderContacts(): HTMLElement {
    const data = buyer.getData();
    const errors = getContactsErrors(buyer.validate());

    return contactsForm.render({
        phone: data.phone,
        email: data.email,
        valid: errors.length === 0,
        errors
    });
}

function renderSuccess(total: number): HTMLElement {
    return success.render({ total });
}

function openModalWindow(content: HTMLElement): void {
    modal.render({ content });
    modal.open();
}

eventEmitter.on(events.productsChange, () => {
    renderCatalog();
});

eventEmitter.on(events.previewChanged, () => {
    renderPreview();
});

eventEmitter.on<ProductEvent>(events.productSelect, ({ id }) => {
    const product = products.getItemById(id);

    if (!product) {
        return;
    }

    products.setPreview(product);
    openModalWindow(previewCard.render());
});

eventEmitter.on(events.cartChanged, () => {
    renderHeader();
    renderCart();
    renderPreview();
});

eventEmitter.on(events.cartOpen, () => {
    openModalWindow(buyerCart.render());
});

eventEmitter.on(events.orderOpen, () => {
    openModalWindow(orderForm.render());
});

eventEmitter.on<FormEvent>(events.formChange, ({ field, value }) => {
    const paymentValue = field === "payment" ? (value as BuyerPayment) : value;
    buyer.setData({ [field]: paymentValue } as Partial<BuyerData>);
});

eventEmitter.on(events.buyerChanged, () => {
    renderOrder();
    renderContacts();
});

eventEmitter.on(events.orderSubmit, () => {
    openModalWindow(contactsForm.render());
});

eventEmitter.on(events.contactsSubmit, () => {
    openModalWindow(success.render());
});

eventEmitter.on(events.contactsSubmit, () => {
    const data = buyer.getData();

    if (!data.payment) {
        return;
    }

    const order: OrderRequest = {
        ...data,
        payment: data.payment,
        items: cart.getItems().map((item) => item.id),
        total: cart.getTotalPrice(),
    };

    larekApi.createOrder(order).then((response) => {
        cart.clearCart();
        buyer.clearData();
        products.setPreview(null);
        openModalWindow(renderSuccess(response.total));
    })
    .catch((err) => {
        console.error("Ошибка оформления заказа:", err);
    });
});

eventEmitter.on(events.modalClose, () => {
    modal.close();
});

eventEmitter.on(events.successClose, () => {
    modal.close();
});

renderHeader();
renderCart();
renderOrder();
renderContacts();
