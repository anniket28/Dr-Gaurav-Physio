const { urlencoded } = require('express')
const express=require('express')
const path=require('path')
const nodemailer=require('nodemailer')
const session=require('express-session')
const flash=require('connect-flash')

// Port
const port=process.env.PORT || 2000 

// App
const app=express()

// Use
app.use('/static',express.static('static'))
app.use(urlencoded({extended:false}))
app.use(session({
    secret:'c460b93e4f309584b14706194b1f5d46c2153930a2e1ed8fa46310bf36f05ef7',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())

// Set
app.set('view-engine','ejs')
app.set('views',path.join(__dirname,'views'))

// Current Year
let dt=new Date()
let currentYear=dt.getFullYear()

// Home Page
app.get('/',(req,res)=>{
    res.status(200).render('index.ejs',{currentYear:currentYear,enquiry_posted:req.flash('enquiry_posted'),appointment_booked:req.flash('appointment_booked')})
})

// Enquiry Post Request
app.post('/enquiry',(req,res)=>{
    try {
        person_name=req.body.name
        person_contact=req.body.contact
        person_enquiry=req.body.enquiry
        // Transporter
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'newmailer715@gmail.com',
                pass:'xvivyybvtxcnsvkr'
            }
        })
        // Mail Options
        var mailOptions={
            from:'newmailer715@gmail.com',
            to:'kartikenminocha@gmail.com',
            subject:'New Quick Enquiry',
            text:`A new quick enquiry has been posted. \nDetails:\nPerson's Name : ${person_name}\nPerson's Contact Number : ${person_contact}\nPerson's Problem/Enquiry : ${person_enquiry} `
        }
        // Send Mail
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent : '+info.response)
            }
        })
        req.flash('enquiry_posted','Thank You for posting an Enquiry. We will get back to you soon.')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Book Appointment Post Request
app.post('/book-appointment',(req,res)=>{
    try {
        person_name=req.body.name
        person_email=req.body.email
        person_contact=req.body.contact
        person_date_slot=req.body.dateSlot
        person_time_slot=req.body.timeSlot
        person_location=req.body.location
        // Transporter1
        var transporter1=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'newmailer715@gmail.com',
                pass:'xvivyybvtxcnsvkr'
            }
        })
        // Mail Options1
        var mailOption1={
            from:'newmailer715@gmail.com',
            to:'kartikenminocha@gmail.com',
            subject:'New Appointment',
            text:`A new appointment has been booked.\nDetails:\nPerson's Name : ${person_name}\nPerson's Email : ${person_email}\nPerson's Contact Number : ${person_contact}\nAppointment Date : ${person_date_slot}\nAppointment Time :  ${person_time_slot}\nLocation :  ${person_location}`
        }
        // Send Mail
        transporter1.sendMail(mailOption1,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent '+info.response)
            }
        })
        // Transporter2
        var transporter2=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'doctorgauravphysio@gmail.com',
                pass:'kijvvfzwfalryfdo'
            }
        })
        // Mail Options2
        var mailOption2={
            from:'doctorgauravphysio@gmail.com',
            to:person_email,
            subject:'Appointment Booked',
            text:`Your appointment has been booked successfully with us. Please check out the details below.\nName : ${person_name}\nContact Number : ${person_contact}\nAppointment Date : ${person_date_slot}\nAppointment Time :  ${person_time_slot}`
        }
        // Send Mail to User
        transporter2.sendMail(mailOption2,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent To User '+info.response)
            }
        })
        req.flash('appointment_booked','Your appointment has been booked successfully.')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// App Run
app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})