const checkoutRouter = require('express').Router()
const mercadoP = require('mercadopago');

mercadoP.configure({
    access_token: "TEST-3654398483251205-030418-77f3aadc4ce3f0ab0371280938803852-460318749",
});



checkoutRouter.post('/', async (req, res)=>{
  const {title, unit_price, quantity} = req.body
  let preference = {
    items: [
      { 
        title: 'My Item',
        unit_price: 1,
        quantity: 1,
        currency_id:'ARS'
      }
    ],
    notification_url: "http://localhost:3001/checkout/notifications",
    /* back_urls: {
        "success": "http://localhost:3000/checked",
        "failure": "http://localhost:3000/checked",
        "pending": "http://localhost:3000/checked"
    }, */
    /* auto_return: "approved", */
  };
      
  mercadoP.preferences.create(preference)
    .then(function(response){
      return res.json(response)
      /* global.id = response.body.id; */
    }).catch(function(error){
      console.log(error);
    });
});

checkoutRouter.post("/notification", (req, res) => {
  const data = req.query;
  console.log(data)
  res.status(200).send('notificación');
})

module.exports = checkoutRouter