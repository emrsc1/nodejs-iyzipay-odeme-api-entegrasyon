const Iyzipay = require("iyzipay");

var iyzipay = new Iyzipay({
  apiKey: process.env.IYZICOAPIKEY,
  secretKey: process.env.IYZICOSECRETKEY,
  uri: process.env.IYZICOLINK,
});
async function payment(req,res){
    try{
        return res.render('payment',{
            title:"Ödeme Yap"
        })
    }catch(err){
        console.log(err)
    }
}
async function pay(req, res) {
  try {
    const { cardHolderName, cardNumber, expireMonth, expireYear, cvc } =
      req.body;
    var request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      price: "1",
      paidPrice: "1",
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "http://10.0.2.2:3000/api/iyzico/payFinish", // işlem tamamlandıktan sonra yönlendirilecek adres
      paymentCard: {
        cardHolderName: cardHolderName,
        cardNumber: cardNumber,
        expireMonth: expireMonth,
        expireYear: expireYear, 
        cvc: cvc,
      },
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101",
          name: "Binocular",
          category1: "Collectibles",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "0.5",
        },
        {
          id: "BI102",
          name: "Game code",
          category1: "Game",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: "0.5",
        },
      ],
    };
    iyzipay.threedsInitialize.create(request, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      } else {
        if (result["status"] == "success") {
          let buff = Buffer.from(result.threeDSHtmlContent, "base64");
          const decodedString = buff.toString("utf8");
          return res
            .status(200)
            .send(
              `<!doctype html>\n<html lang=\"en\">\n<head>\n    <title>iyzico Mock 3D-Secure Processing Page</title>\n</head>\n<body>\n<form id=\"iyzico-3ds-form\" action=\"https://sandbox-api.iyzipay.com/payment/mock/init3ds\" method=\"post\">\n    <input type=\"hidden\" name=\"orderId\" value=\"mock12-9584229962790500iyziord\">\n    <input type=\"hidden\" name=\"bin\" value=\"552879\">\n    <input type=\"hidden\" name=\"successUrl\" value=\"https://sandbox-api.iyzipay.com/payment/iyzipos/callback3ds/success/3\">\n    <input type=\"hidden\" name=\"failureUrl\" value=\"https://sandbox-api.iyzipay.com/payment/iyzipos/callback3ds/failure/3\">\n    <input type=\"hidden\" name=\"confirmationUrl\" value=\"https://sandbox-api.iyzipay.com/payment/mock/confirm3ds\">\n    <input type=\"hidden\" name=\"PaReq\" value=\"0b6d9ec1-eff8-4878-a54f-0fb4e51a0eb4\">\n</form>\n<script type=\"text/javascript\">\n    document.getElementById(\"iyzico-3ds-form\").submit();\n</script>\n</body>\n</html>`
            );
        } else {
          return res.status(500).send(result["errorMessage"]);
        }
      }
    });
  } catch (e) {
    res.status(500).send(`İşlem Başarısız ${e}`);
  }
  
}

async function payFinish(req, res) {
  try {
    iyzipay.threedsPayment.create(
      {
        conversationId: "123456789",
        locale: Iyzipay.LOCALE.TR,
        paymentId: req.body.paymentId,
      },
      function (err, result) {
        console.log(result);
        if (err) {
          return res.status(500).send(
            `
                <html>
                        <head>
                         <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                         </head>
                         <style>
                         body {
                         text-align: center;
                         padding: 40px 0;
                         background: #EBF0F5;
                         }
                         h1 {
                        color: #ff0e0e;
                         font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                         font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                        }
                         p {
                         color: #404F5E;
                         font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-size:20px;
                         margin: 0;
                        }
                         i {
                         color: #ff0e0e;
                        font-size: 200px;
                        line-height: 200px;
                        margin-left:-15px;
                        }
                       .card {
                         background: white;
                        padding: 60px;
                         border-radius: 4px;
                        box-shadow: 0 2px 3px #C8D0D8;
                         display: inline-block;
                        margin: 0 auto;
                         }
                        </style>
                        <body>
                         <div class="card">
                        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                         <i class="checkmark">×</i>
                         </div>
                         <h1>Başarısız</h1>
                         <p>${result["errorMessage"]}!</p>
                         </div>
                         </body>
                         </html>
                `
          );
        } else {
          if (result["status"] == "success") {
            return res.status(200).send(
              `
                   <html>
                           <head>
                           <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                           </head>
                           <style>
                           body {
                           text-align: center;
                           padding: 40px 0;
                           background: #EBF0F5;
                           }
                           h1 {
                           color: #88B04B;
                           font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                           font-weight: 900;
                           font-size: 40px;
                           margin-bottom: 10px;
                           }
                           p {
                           color: #404F5E;
                           font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                           font-size:20px;
                           margin: 0;
                           }
                           i {
                           color: #9ABC66;
                           font-size: 100px;
                           line-height: 200px;
                           margin-left:-15px;
                           }
                           .card {
                           background: white;
                           padding: 60px;
                           border-radius: 4px;
                           box-shadow: 0 2px 3px #C8D0D8;
                           display: inline-block;
                           margin: 0 auto;
                           }
                           </style>
                           <body>
                           <div class="card">
                           <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                           <i class="checkmark">✓</i>
                           </div>
                           <h1>Başarılı</h1>
                           <p>Ödeme işleminiz başarıyla tamamlandı!</p>
                           </div>
                           </body>
                           </html>
                   `
            );
          } else {
            return res.status(500).send(
              `
                     <html>
                             <head>
                              <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                              </head>
                              <style>
                              body {
                              text-align: center;
                              padding: 40px 0;
                              background: #EBF0F5;
                              }
                              h1 {
                             color: #ff0e0e;
                              font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                              font-weight: 900;
                             font-size: 40px;
                             margin-bottom: 10px;
                             }
                              p {
                              color: #404F5E;
                              font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                             font-size:20px;
                              margin: 0;
                             }
                              i {
                              color: #ff0e0e;
                             font-size: 200px;
                             line-height: 200px;
                             margin-left:-15px;
                             }
                            .card {
                              background: white;
                             padding: 60px;
                              border-radius: 4px;
                             box-shadow: 0 2px 3px #C8D0D8;
                              display: inline-block;
                             margin: 0 auto;
                              }
                             </style>
                             <body>
                              <div class="card">
                             <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                              <i class="checkmark">×</i>
                              </div>
                              <h1>Başarısız</h1>
                              <p>${result["errorMessage"]}!</p>
                              </div>
                              </body>
                              </html>
                     `
            );
          }
        }
      }
    );
  } catch (e) {
    return res.status(500).send(
      `
        <html>
                <head>
                 <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                 </head>
                 <style>
                 body {
                 text-align: center;
                 padding: 40px 0;
                 background: #EBF0F5;
                 }
                 h1 {
                color: #ff0e0e;
                 font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                 font-weight: 900;
                font-size: 40px;
                margin-bottom: 10px;
                }
                 p {
                 color: #404F5E;
                 font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                font-size:20px;
                 margin: 0;
                }
                 i {
                 color: #ff0e0e;
                font-size: 200px;
                line-height: 200px;
                margin-left:-15px;
                }
               .card {
                 background: white;
                padding: 60px;
                 border-radius: 4px;
                box-shadow: 0 2px 3px #C8D0D8;
                 display: inline-block;
                margin: 0 auto;
                 }
                </style>
                <body>
                 <div class="card">
                <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                 <i class="checkmark">×</i>
                 </div>
                 <h1>Başarısız</h1>
                 <p>${e}!</p>
                 </div>
                 </body>
                 </html>
        `
    );
  }
}

module.exports = {
  pay,
  payFinish,
  payment,
};
