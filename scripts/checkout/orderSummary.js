import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurreny} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from './paymentSummary.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function renderOrderSummary() {

    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionsId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML +=
            `
                <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                    Delivery date: ${dateString}
                    </div>

                    <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingProduct.image}">

                    <div class="cart-item-details">
                        <div class="product-name">
                        ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                        ${matchingProduct.getPrice()}
                        </div>
                        <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                        <span>
                            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary">
                            Update
                        </span>
                        <span class="delete-quantity-link js-delete-link-${matchingProduct.id} js-delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">
                        Choose a delivery option:
                        </div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                    </div>
                </div>
            `
        ;
    });


    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {

            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            let priceString = deliveryOption.priceCents === 0
                ? 'Free'
                : `$${formatCurreny(deliveryOption.priceCents)} -`;
            
            const isChecked = deliveryOption.id === cartItem.deliveryOptionsId

            html +=
                `
                    <div class="delivery-option js-delivery-option" 
                    data-product-id="${matchingProduct.id}" 
                    data-delivery-option-id="${deliveryOption.id}">
                        <input type="radio"
                            ${isChecked ? 'checked' : ''}
                            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="delivery-option-date">
                                ${dateString}
                            </div>
                            <div class="delivery-option-price">
                                ${priceString} Shipping
                            </div>
                        </div>
                    </div>
                `
        });
        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            console.log(cart);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            renderPaymentSummary();
            
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const productId = element.dataset.productId;
            const deliveryOptionsId = element.dataset.deliveryOptionId;
            updateDeliveryOption(productId, deliveryOptionsId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}