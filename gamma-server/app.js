const express = require('express')
const app = express()
const port = 3055
const axios = require('axios')
var cors = require('cors')
require('dotenv').config()
app.use(cors())
const apiKey = process.env.WP_AUTH_TEST

app.get('/checkout', async (req, res) => {
    const bodyInfo = JSON.parse(req?.query.data) || null
    console.log(bodyInfo.line_items[0])
    
    if (bodyInfo) {
        const checkout = {
            method: 'POST',
            url: 'https://gamaoutillage.net/wp-json/wc/v3/orders',
            headers: {
                Authorization: apiKey
            },
            params: {
                payment_method: bodyInfo.payment_method,
                payment_method_title: 'Paiement à la livraison',
                billing: bodyInfo.billing,
                shipping: bodyInfo.shipping,
                set_paid: false,
                line_items: bodyInfo.line_items,
                shipping_lines: bodyInfo.shipping_lines
            },
        }
        await axios.request(checkout).then((data) => {
            const dataJ = data.data
            res.send(dataJ)
        })
    } else {
        res.send('fill all data')
    }
     
   // res.send(dataJ)
}
)

app.get('/products', async (req, res) => {
  
    const params = req?.query.page || 1
    const products = {
        method: 'GET',
        url: 'https://gamaoutillage.net/wp-json/wc/v3/products',
        params: params,
        headers: {
            Authorization: apiKey
        }
    }
    await axios.request(products).then((data) => {
        const dataJ = data.data
        res.send(dataJ)
    })
}
)

app.get('/', (req, res) => {
    res.send('you need api key to access')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})