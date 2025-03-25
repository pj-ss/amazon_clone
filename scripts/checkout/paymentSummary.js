import {cart} from "../../data/cart.js";
import {getDeliveryOption} from "../../data/deliveryOptions.js";
import {getProduct} from "../../data/products.js";
import {formatCurreny} from "../utils/money.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);
        shippingPriceCents += deliveryOption.priceCents
    });

    const totalPreTaxCents = productPriceCents + shippingPriceCents
    const taxCents = totalPreTaxCents * 0.1
    const totalPostTaxCents = totalPreTaxCents + taxCents

    console.log(productPriceCents);
    console.log(shippingPriceCents);

    const paymentSummaryHTML =
    `
        <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (3):</div>
                <div class="payment-summary-money">$${formatCurreny(productPriceCents)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurreny(shippingPriceCents)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurreny(totalPreTaxCents)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurreny(taxCents)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${formatCurreny(totalPostTaxCents)}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}


/*
item quantity * price
shipping option price

A) total of both^
B) total * 0.1

order total A*B
*/