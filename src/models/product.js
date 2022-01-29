class Product {

    // constructor(id, ownerId, title, imageUrl, description, price, ) {

    //     this.id = id;
    //     this.ownerId = ownerId;
    //     this.title = title;
    //     this.imageUrl = imageUrl;
    //     this.description = description;
    //     this.price = price;
        
    // }

    constructor(options) {

        this.id = options.id;
        this.ownerId = options.ownerId;
        this.title = options.title;
        this.imageUrl = options.imageUrl;
        this.description = options.description;
        this.price = options.price;
        
    }

}

export default Product;