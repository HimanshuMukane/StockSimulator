 //speed of how often stocks update
 const STOCK_UPD = 2;

 //Thank God for MDN - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 function getRandomArbitrary(min, max) {
     return Math.random() * (max - min) + min;
 }

 const store = new Vuex.Store({
     state: {
         stocks: [{
             name: 'ADANI PORT & SEZ LTD',
             symbol: 'ADANIPORTS',
             price: 678.05,
             held: 0
         }, {
             name: 'ASIAN PAINTS LIMITED',
             symbol: 'ASIANPAINT',
             price: 2726.50,
             held: 0
         }, {
             name: 'AXIS BANK LIMITED',
             symbol: 'AXISBANK',
             price: 640.89,
             held: 0
         }, {
             name: "BAJAJ FINANCE LIMITED",
             symbol: "BAJFINANCE",
             price: 5575.89,
             held: 0
         }, {
             name: "BRITANNIA INDUSTRIES LTD",
             symbol: "BRITANNIA",
             price: 3431.92,
             held: 0
         }, {
             name: "CIPLA LTD",
             symbol: "CIPLA",
             price: 945.88,
             held: 0
         }, {
             name: "HDFC BANK LTD",
             symbol: "HDFCBANK",
             price: 1331.92,
             held: 0
         }, {
             name: "HINDUSTAN UNILEVER LTD",
             symbol: "HINDUNILVR",
             price: 2317.88,
             held: 0
         }, {
             name: "INDIGO PAINTS LIMITED",
             symbol: "INDIGOPNTS",
             price: 1393.88,
             held: 0
         }, {
             name: "ASIAN PAINTS LIMITED",
             symbol: "ASIANPAIN",
             price: 2726.50,
             held: 0
         }, {
             name: "AXIS BANK LIMITED",
             symbol: "AXISBAN",
             price: 640.89,
             held: 0
         }, {
             name: "BAJAJ AUTO LIMITED",
             symbol: "BAJAJ-AUT",
             price: 3888.68,
             held: 0
         }, {
             name: "BAJAJ FINANCE LIMITED",
             symbol: "BAJFINANC",
             price: 5575.89,
             held: 0
         }, {
             name: "BRITANNIA INDUSTRIES LTD",
             symbol: "BRITANNI",
             price: 3431.92,
             held: 0
         }, {
             name: "CIPLA LTD",
             symbol: "CIPL",
             price: 945.88,
             held: 0
         }, {
             name: "HDFC BANK LTD",
             symbol: "HDFCBAN",
             price: 1331.92,
             held: 0
         }, {
             name: "HINDUSTAN UNILEVER LTD",
             symbol: "HINDUNILV",
             price: 2317.88,
             held: 0
         }, {
             name: "INDIGO PAINTS LIMITED",
             symbol: "INDIGOPNT",
             price: 1393.88,
             held: 0
         }, {
             name: "COLGATE PALMOLIVE LTD",
             symbol: "COLPAL",
             price: 1517.89,
             held: 0
         }],

         holdings: [],
         cash: 10000
     },

     getters: {
         holdingValue(state) {
             return state.stocks.reduce(function(current, elm) {
                 return current + elm.price * elm.held;
             }, 0);
         }
     },

     mutations: {
         changeStocks(state) {
             state.stocks.forEach(stock => {
                 stock.price += getRandomArbitrary(-20, 20);
                 if (stock.price < 0) stock.price = 0;
             });
         },
         buyStock(state, order) {
             console.log('order is ' + JSON.stringify(order));
             //first, find the stock
             let stock = state.stocks.findIndex(elm => {
                 return elm.name === order.stock;
             });
             if (stock >= 0) {
                 let purchasePrice = (state.stocks[stock].price * order.amount).toFixed(2);
                 if (state.cash >= purchasePrice) {
                     state.stocks[stock].held += order.amount;
                     state.cash -= purchasePrice;
                 }
             }
         },
         sellStock(state, order) {
             console.log('order is ' + JSON.stringify(order));
             //first, find the stock
             let stock = state.stocks.findIndex(elm => {
                 return elm.name === order.stock;
             });
             if (stock >= 0) {
                 if (state.stocks[stock].held >= order.amount) {
                     let sellPrice = (state.stocks[stock].price * order.amount).toFixed(2);
                     state.stocks[stock].held -= order.amount;
                     state.cash += Number(sellPrice);
                 }
             }
         }
     }
 });



 const app = new Vue({
     el: '#app',
     store,
     data() {
         return {
             buy: 0,
             buyStock: null,
             buyError: false,
             sell: 0,
             sellStock: null,
             sellError: false
         };

     },
     filters: {
         money(value) {
             let numb = Number(value).toFixed(2);
             return 'Rs.' + numb;
         }
     },

     mounted: function() {
         setInterval(() => {
             console.log('running stock update');
             store.commit('changeStocks');
         }, STOCK_UPD * 1000);
     },
     computed: {
         stocks() {
             return store.state.stocks;
         },
         holdingValue() {
             return store.getters.holdingValue;
         },
         cash() {
             return store.state.cash;
         }
     },

     methods: {
         buyStocks() {
             if (this.buy < 0) this.buy = 0;
             if (this.buy === 0) return;
             console.log('going to buy ' + this.buy + ' of ' + this.buyStock);
             store.commit('buyStock', {
                 amount: this.buy,
                 stock: this.buyStock
             });
             this.buy = 0;
             this.buyStock = null;
         },
         sellStocks() {
             if (this.sell < 0) this.sell = 0;
             if (this.sell === 0) return;
             console.log('going to sell ' + this.sell + ' of ' + this.sellStock);
             store.commit('sellStock', {
                 amount: this.sell,
                 stock: this.sellStock
             });
             this.sell = 0;
             this.sellStock = null;
         }
     }
 });