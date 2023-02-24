import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {

  state: () => ({
    cart: []
  }),


  actions: {
    async getCart() {
      const data = await $fetch('http://localhost:4000/cart')
      this.cart = data
    },

    async deleteFromCart(product) {
      this.cart = this.cart.filter(prod => {
        return prod.id !== product.id // This action removes the product from the state only
      })
      // Delete request to EndPoint [to remove product from DB/JSON etc...]
      await $fetch('http://localhost:4000/cart/' + product.id, {
        method: 'DELETE'
      })
    },

    async incQuantity(product) {
      let updateProduct
      this.cart = this.cart.map(prod => {
        if (prod.id === product.id) {
          prod.quantity++
          updateProduct = prod // This action increases the product quantity property in the state only
        }
        return prod
      })
      // Make PUT request to EndPoint [to increases the product quantity property in DB/JSON etc...]
      if (updateProduct) {
        await $fetch('http://localhost:4000/cart/' + product.id, {
          method: 'PUT',
          body: JSON.stringify(updateProduct)
        })
      }
    },

    async decQuantity(product) {
      let updatedProduct
      this.cart = this.cart.map((prod) => {
        if (prod.id === product.id && prod.quantity > 1) {
          prod.quantity--
          updatedProduct = prod // This action decreases the product quantity property in the state only
        }
        return p
      })
       // Make PUT request to EndPoint [to decrease the product quantity property in DB/JSON etc...]
      if (updatedProduct) {
        await $fetch('http://localhost:4000/cart/' + product.id, {
          method: 'PUT',
          body: JSON.stringify(updatedProduct)
        })
      }
    },

    async addToCart(product) {
      const exists = this.cart.find((prod) => prod.id === product.id)
      if (exists) {
        this.incQuantity(product)
      }
      if (!exists) {
        this.cart.push({...product, quantity: 1}) // This action adds the product in the state only

        // Make POST request to EndPoint [to add the product object in DB/JSON etc...]
        await $fetch('http://localhost:4000/cart', {
          method: 'POST',
          body: JSON.stringify({...product, quantity: 1})
        })
      } 
    }
  },

  getters: {
    cartTotal() {
      return this.cart.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    
    numberOfProducts() {
      return this.cart.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    }
  }
})