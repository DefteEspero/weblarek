import './scss/styles.scss';

import { Cart } from './components/Models/Cart.ts';
import { Buyer } from  './components/Models/Buyer.ts';
import { Products } from './components/Models/Products.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';
import { API_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';
import { EventEmitter, events } from './components/base/Events.ts';
import { BuyerData, Event, BuyerError, BuyerPayment, OrderRequest, FormEvent} from'./types/index.ts'
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { Page } from './components/View/Page.ts';
import { PreviewCard } from './components/View/PreviewCard.ts';
import { BuyerCart } from './components/View/BuyerCart.ts';
import { Modal } from './components/View/Modal.ts';
import { CatalogCard } from './components/View/CatalogCard.ts';
import { CartCard } from './components/View/CartCard.ts';
import { OrderSuccess } from './components/View/OrderSuccess.ts';
import { OrderForm } from './components/View/OrderForm.ts';
import { ContactsForm } from './components/View/ContactsForm.ts';

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);
const eventEmitter = new EventEmitter();
const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), eventEmitter);
const products = new Products(eventEmitter);
const cart = new Cart(eventEmitter);
const buyer = new Buyer(eventEmitter);
const getOrderErrors = (errors: BuyerError): string[] => [errors.payment, errors.address].filter(Boolean) as string[];
const getContactsErrors = (errors: BuyerError): string[] => [errors.email, errors.phone].filter(Boolean) as string[];
const currentOrder = new OrderForm(
    cloneTemplate<HTMLFormElement>("#order"),
    eventEmitter
);
const currentContacts = new ContactsForm(
    cloneTemplate<HTMLFormElement>('#contacts'),
    eventEmitter
);
let ModalWindow: "preview" | "basket" | "order" | "contacts" | "success" | null = null;

larekApi.getProducts().then((response) => {
    products.setItems(response.items);
    console.log("Каталог товаров с сервера: ", products.getItems());
})
.catch((error: unknown) => {
    console.error("Ошибка получения каталога: ", error);
});

function catalogRender(): void {
    const cards = products.getItems().map((item) => {
        const card = new CatalogCard(cloneTemplate<HTMLButtonElement>("#card-catalog"), eventEmitter);
        return card.render(item);
    });

    page.render({
        catalog: cards,
        counter: cart.getItemCount(),
    });
}

function openModalWindow(content: HTMLElement, state: typeof ModalWindow): void {
    ModalWindow = state;
    modal.render({ content });
    modal.open();
}

function previewRender(): void {
    const preview = products.getPreview();

    if (!preview) {
        return;
    }

    const card = new PreviewCard(
        cloneTemplate<HTMLElement>("#card-preview"),
        eventEmitter
    );

    const inCart = cart.inCart(preview.id);
    const buttonDisabled = preview.price === null;
    const buttonText = preview.price === null ? "Недоступно" : (inCart ? "Удалить из корзины" : "Купить");

    openModalWindow(card.render({
        ...preview,
        buttonText,
        buttonDisabled,
        inCart
    }), "preview");
}

eventEmitter.on(events.productsChange, () => {
    catalogRender();
});

eventEmitter.on(events.previewChanged, () => {
    if (products.getPreview()) {
        previewRender();
    }
});

eventEmitter.on(events.productSelect, (data: { id: string }) => {
    const product = products.getItemById(data.id);

    if (!product) {
        return;
    }

    products.setPreview(product);
});

function cartRender(): void {
    const cartItems = cart.getItems().map((item, index) => {
        const cartCard = new CartCard(
            cloneTemplate<HTMLElement>("#card-basket"),
            eventEmitter
        );

        return cartCard.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    const basket = new BuyerCart(
        cloneTemplate<HTMLElement>("#basket"),
        eventEmitter
    );

    openModalWindow(basket.render({
        items: cartItems,
        total: cart.getTotalPrice(),
        disabled: cart.getItemCount() === 0
    }), "basket");
}

eventEmitter.on<Event>(events.productsAdd, ({ id }) => {
    const product = products.getItemById(id);
    if (!product || product.price === null) {
        return;
    }
    cart.addItem(product);
});

eventEmitter.on<Event>(events.productsRemove, ({ id }) => {
    const product = cart.getItems().find((item) => item.id === id) ?? products.getItemById(id);
    if (!product) {
        return;
    }
    cart.removeItem(product);
});

eventEmitter.on(events.cartChanged, () => {
    page.render({ counter: cart.getItemCount() });

    if (ModalWindow === "basket") {
        cartRender();
    }

    if (ModalWindow === "preview" && products.getPreview()) {
        previewRender();
    }
});

eventEmitter.on(events.cartOpen, () => {
    cartRender();
});

function FormOrder(ModalWindow: boolean): void {
    const data = buyer.getData();
    const errors = buyer.validate();
    const orderErrors = getOrderErrors(errors);
    const formContent = currentOrder.render({
        address: data.address,
        payment: data.payment,
        valid: orderErrors.length === 0,
        errors: orderErrors.join("")
    });

    if (ModalWindow) {
        openModalWindow(formContent, "order");
    }
}

eventEmitter.on(events.orderOpen, () => {
    FormOrder(true);
});

eventEmitter.on<FormEvent>(events.formChange, ({ field, value }) => {
    const normalizedValue = field === "payment" ? value as BuyerPayment: value;
    buyer.setData({ [field]: normalizedValue } as Partial<BuyerData>);
});

eventEmitter.on(events.buyerChanged, () => {
    if (ModalWindow === "order") {
        FormOrder(false);
    }

    if (ModalWindow === "contacts") {
        FormContacts(false);
    }
});

function FormContacts(ModalWindow: boolean): void {
    const data = buyer.getData();
    const errors = buyer.validate();
    const orderErrors = getContactsErrors(errors);
    const formContent = currentContacts.render({
        phone: data.phone,
        email: data.email,
        valid: orderErrors.length === 0,
        errors: orderErrors.join("")
    });

    if (ModalWindow) {
        openModalWindow(formContent, "contacts");
    }
}

eventEmitter.on(events.orderSubmit, () => {
    if (getOrderErrors(buyer.validate()).length > 0) {
        return;
    }

    FormContacts(true);
});

eventEmitter.on(events.contactsSubmit, () => {
    const validationErrors = buyer.validate();
    if (getContactsErrors(validationErrors).length > 0 || getOrderErrors(validationErrors).length > 0) {
        return;
    }

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
        FormSuccess(response.total);
    })
    .catch((err) => {
        console.error("Ошибка оформления заказа:", err);
    });
});

function FormSuccess(total: number): void {
    const success = new OrderSuccess(cloneTemplate<HTMLElement>("#success"), eventEmitter);
    openModalWindow(success.render({ total }), "success");
}

eventEmitter.on(events.modalClose, () => {
    modal.close();
    ModalWindow = null;
});

eventEmitter.on(events.successClose, () => {
    modal.close();
    ModalWindow = null;
});

