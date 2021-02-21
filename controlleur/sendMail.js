const sgMail = require('@sendgrid/mail');
const dotenv = require("dotenv").config();

async function sendMail(theEmployee, secretPsw){
    console.log("ppppppppppppppppppp 3. sendmail c  employee e pass ", theEmployee, secretPsw);

    sgMail.setApiKey(process.env.MY_ID_SEND_GRID);
    console.log("ver se tem a boa key ", sgMail);
  
    const msg = {
      to: theEmployee.email,
      from: 'luisteixeiraprojet@gmail.com',
      subject: 'Luis Teixeira - Vos Identifiants ',
    //  text: 'Mme/M. ' + theEmployee.lastName + ' <br/> '  ,
      html: '<br/> Mme/M. <strong> ' + theEmployee.lastName + '</strong>'+
            '<p> Bienvenu(e) chez Luis Teixeira! </p>' +
            '<p> Nous avons le plaisir de vous informer que votre compte a été crée. Vous pouvez désormais accéder à votre espace personnel avec les identifiants suivants: </p>' +
            '<p style="text-align:center"> <strong> Votre Identifiant: </strong> ' + theEmployee.email + '</p> ' +
            '<p style="text-align:center"> <strong> Votre mot-de-pass: </strong> ' + secretPsw + '</p>' +
            '<p> Nous vous rappelons que vous pouvez à tout moment changer votre mot-de-pass sur l`onglet "Profil". </p>' +
            '<p> Restant à votre disposition pour tout renseignement complémentaire. </p>'+
            '<p> Cordialement, </p>' +
            '<p> Luis Teixeira </p>'

    };
  
    //ES8
  (async () => {
    try {
     let x = await sgMail.send(msg);
   
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }
  })();
}
module.exports = sendMail;