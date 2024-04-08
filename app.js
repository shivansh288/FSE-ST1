// npm i nodemailer
// npm i dotenv
const express=require('express');
const nodemailer=require('nodemailer');
const app=express();
require('dotenv').config();

app.set('view engine','hbs');
app.use(express.json());
app.use(express.urlencoded()); 

let otp;
function generateOtp(){
     otpVal = Math.floor(1000 + Math.random() * 9000);
    console.log(otpVal);
    return otpVal;
}

app.get('/', (req, res)=> {
    res.render('otp');
});

app.post('/send',async(req,res)=>{
    // app pass is used to bypass th two factor authen of otp sent ..sirf user pass se dekr hm 1way authen kr rhe h ..2way krne ke liye app pass is used
    //transporter just ek object h jiske pass sendmail naam ka fncn hota h 
    
    // hmne user me mail bhej di h aready to hmne dubara from vale section isliye bheji bcz
    // i) ki ye format hota h poora ki " to from subject text" 
    // ii) google pr hr mail ka apna apna hota h ki usko verify krne ke liye ki jo user login h vhi from vale section me h ya nhi  
    otp=generateOtp();
    const recemail=req.body.email;
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: "shivansh1318.be21@chitkara.edu.in",
            // environment var. are used so that we don't have to write and show our pass here ..and then agr new file me bana kr daal de pass but agr usse github pr daale to vo file bhi daalni pdegi so we created app pass bcz here app is trying to login not the user
            pass:process.env.PASS, 
        }
    })
    //vesl lijz xhbp qdjj
    const mail={
        to: recemail,
        from: "shivansh1318.be21@chitkara.edu.in",
        subject:"Hi nodemailer",
        text: `${otp}`,
    }

    try{
        await transporter.sendMail(mail);
        res.send("otp sent successfully :D");
    }
    catch(err){
        console.log(err);
        res.send("OOPS! otp not sent");
    }
});



app.post('/verify',(req, res)=> {
   
    if (req.body.otp == otp) {
        res.send("You entered correct otp! :)");
    }
    else {
        res.send('otp is incorrect');
    }
});

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})