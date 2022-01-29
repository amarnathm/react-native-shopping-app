class CartProduct {

    constructor(product, quantity ) {

        this.id = product.id;

        // if somehow product is already a CartProduct, then just get it's product
        if (product.product) {
            this.product = {...product}
        } else {
            this.product = product;
        }
        
        this.quantity = quantity;
        
    };

    // incr = () => {
    //     this.quantity = this.quantity + 1;
    // }

    // decr = () => {
    //     if (this.quantity > 0) {
    //        this.quantity = this.quantity - 1;
    //     } 
    // }

    // remove = () => {
    //     this.quantity = 0;
    // }

}

export default CartProduct;