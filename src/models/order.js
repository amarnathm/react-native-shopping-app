import  moment from "moment";


class Order {

    constructor(options) {
        this.id = options.id;
        this.items = options.items;
        this.amount = options.amount;

        this.date = options.date;

    }

    // constructor(id, items, amount, date) {
    //     this.id = id;
    //     this.items = items;
    //     this.amount = amount;

    //     this.date = date;

    // }

    get readableDate() {

        // works on ios but not on android. 
        // so install moment
        // return this.date.toLocaleString('en-US', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        //     hour: '2-digit',
        //     minute: '2-digit'
        // })

        return moment(this.date).format('MMMM Do YYYY, hh:mm')
    }

    get readableDateSmall() {
        return moment(this.date).format('MM-DD-YY')
    }
}

export default Order;