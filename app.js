const express = require("express")
const bodyParser = require('body-parser')
const ejs = require("ejs")
const mongodb = require("mongodb")
const mongoose = require("mongoose")
var session = require('express-session')
var passport = require("passport")
const passportLocalMongoose = require('passport-local-mongoose');
const dotenv = require('dotenv')


const app = express()
app.set("view-engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
dotenv.config()

mongoose.connect(process.env.BASEURL).then((result) => {
    console.log("Success Fully Connected to the Database");
}).catch((err) => {
    console.log(err);
});


// youtube link schema
const youtubelink_schema = {
    _id:Number,
    title:String,
    link:String
}

const yt_link = mongoose.model("yt_link", youtubelink_schema)


//     link1:"asdfad",
//     link2:"sdasdad",
//     link3:"ASASas"
// })

// link1.save()


// User Schema


// Photos Schema

const photos_schema = {
    title:String,
    link:String
}

const photos_link = mongoose.model("photos_link", photos_schema)


const magazine_schema = {
    title:String,
    thubnail_link:String,
    content:String,
    download_link:String

}

const magazine_link = mongoose.model("magazine_link", magazine_schema)

// const new_magazine = new magazine_link({
//     title:"magazine",
//     thubnail_link:"https://raw.githubusercontent.com/tv3200/files/main/LatestMagazine.png",
//     content:"Calvary Premadhara magazine for Sep - October is available for free to Download.",
//     download_link:"https://drive.google.com/file/d/1KWXh-DzrGPxtc6OVFOFpRlgy7-AnatjT/view"

// })

// new_magazine.save()



app.use(require('express-session')({ secret: 'thisishemanth', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


const UserSchema = new mongoose.Schema( {
    email:mongoose.Schema.Types.Mixed,
    password:mongoose.Schema.Types.Mixed 
})

UserSchema.plugin(passportLocalMongoose)


const User = new mongoose.model("User", UserSchema)


passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  


app.get("/login", (req,res)=>{

  if(req.isAuthenticated()){
        res.redirect("/edit")
    }

    else{
        res.render("login.ejs")
    }

    
})

app.post("/login",(req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err) { 
          console.log(err)
         }
        else{
          passport.authenticate("local")(req, res, function(){
            res.redirect("/edit")
            console.log("Successfully Loged In")
            console.log("Redirecting to Admin Page");
          })
        }
      });
      
  
})



app.get("/create",(req,res)=>{

    if(req.isAuthenticated()){
        res.render("admin.ejs")
    }
    else{
        res.redirect("/login")
    }


})


app.post("/create", (req,res)=>{

    
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err){
            console.log("Login Error")
            console.log(err)
            res.redirect("/failure")
        } else {
            passport.authenticate("local")(req,res, function(){
                res.redirect("/success");
                console.log("Successfully Registered")
            });
         }

    });

})


app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  



app.get("/home", (req,res)=>{
    
    
    yt_link.find({}).then(function(links){
        
        photos_link.find({}).then(function(photolink){

            magazine_link.find({}).then((result) => {

                res.render("index.ejs", {
                    link:links,  imglink:photolink, magazine:result})
    
                
            }).catch((err) => {
                console.log(err);
            });


            

            })


     })
     .catch(function(){
         console.log("Error");
     })

    

})


app.get("/tvshedule",(req,res)=>{
    res.render("tvshedule.ejs")
})

app.post("/tvshedule",(req,res)=>{
    const selectedValue = req.body;
    console.log(selectedValue)
})

app.get("/", (req,res)=>{
    res.redirect("/home")
})

app.get("/contact", (req,res)=>{
    res.render("contact.ejs")
})

app.post("/contact", (req,res)=>{
    console.log(req.body)
})

app.get("/donate",(req,res)=>{
    res.render("donate.ejs")
})



app.get('/videos',(req,res)=>{
    res.render('videos.ejs')
})

app.get("/edit", (req,res)=>{

    if(req.isAuthenticated()){
        
        res.render("edit.ejs")

    }
    else{
        console.log("Not Loged in Redirecting to login");
        res.redirect("/login")
    }
  
})

app.post("/edit", (req,res)=>{
    
    const link1 = req.body.link1
    const link2 = req.body.link2
    const link3 = req.body.link3

    yt_link.findByIdAndUpdate(_id = 1, {link: link1}).then((result) => {
        console.log(result);
       
    }).catch((err) => {
        console.log("error");
    });

    // link2

    yt_link.findByIdAndUpdate(_id = 2, {link: link2}).then((result) => {
        console.log(result);
       
    }).catch((err) => {
        console.log("error");
    });

    // link3


    yt_link.findByIdAndUpdate(_id = 3, {link: link3}).then((result) => {
        console.log(result);
       
    }).catch((err) => {
        console.log("error");
    });

    // link4

    yt_link.findByIdAndUpdate(_id = 4, {link: link4}).then((result) => {
        console.log(result);
       
    }).catch((err) => {
        console.log("error");
    });

    // link5

    
    yt_link.findByIdAndUpdate(_id = 5, {link: link5}).then((result) => {
        console.log(result);
       
    }).catch((err) => {
        console.log("error");
    });



    // Photo Link

    photos_link.findOneAndUpdate({title: req.body.selectOption}, {link:req.body.photolink}).then((result)=>{
        console.log("Success fully Changed ");
    })
    .catch((err)=>{
        console.log(err);
    })


    // Magazine
    



    magazine_link.updateMany({title: "magazine"}, {thubnail_link: req.body.thubnail_link, content:req.body.content, download_link : req.body.dlink}).then((result)=>{
        console.log("Success fully Changed ");
    })
    .catch((err)=>{
        console.log(err);
    })
   
    res.redirect("/")

    })







// app.get("/test", (req,res)=>{

//     // magazine links

//     magazine_link.insertMany([{
//         "_id": {
//           "$oid": "6554b73933765ed4f464ec4a"
//         },
//         "title": "magazine",
//         "thubnail_link": "https://jayapaul.org/demos/yoga/images/about-church.jpg",
//         "content": "test",
//         "download_link": "hk",
//         "__v": 0
//       }])

//     //   photos_link

//     photos_link.insertMany([{
//         "_id": {
//           "$oid": "655486c61958915b973fee48"
//         },
//         "title": "s1",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s1.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655486c61958915b973fee49"
//         },
//         "title": "s2",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s2.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655486c61958915b973fee4a"
//         },
//         "title": "s3",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s3.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655486c61958915b973fee4b"
//         },
//         "title": "s4",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s4.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655486c61958915b973fee4c"
//         },
//         "title": "s5",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s5.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655486c61958915b973fee4d"
//         },
//         "title": "s6",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/s6.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040531"
//         },
//         "title": "c1",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/c1.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040532"
//         },
//         "title": "c2",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/c2.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040533"
//         },
//         "title": "c3",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/c3.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040534"
//         },
//         "title": "c4",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/crowd3.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040535"
//         },
//         "title": "c5",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/c5.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "655493e23d272f4485040536"
//         },
//         "title": "c6",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/c6.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc34"
//         },
//         "title": "cs1",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs1.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc35"
//         },
//         "title": "cs2",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs2.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc36"
//         },
//         "title": "cs3",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs3.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc37"
//         },
//         "title": "cs4",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs4.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc38"
//         },
//         "title": "cs5",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs5.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc39"
//         },
//         "title": "cs6",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs6.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc3a"
//         },
//         "title": "cs7",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs7.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554946a07520a42d851fc3b"
//         },
//         "title": "cs8",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/cs8.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554a6a99281bf031e76db44"
//         },
//         "title": "p1",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/potrait-1.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554a6a99281bf031e76db45"
//         },
//         "title": "p2",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/potrait-2.jpg",
//         "__v": 0
//       },{
//         "_id": {
//           "$oid": "6554a6a99281bf031e76db46"
//         },
//         "title": "p3",
//         "link": "https://raw.githubusercontent.com/tv3200/files/main/potrait-3.jpg",
//         "__v": 0
//       }])

//     //   USER

//     User.insertMany([{
//         "_id": {
//           "$oid": "655357f8edb13dcfd2f1c7de"
//         },
//         "username": "q@123.com",
//         "salt": "c313eb519efc85844ef3c1d848216b7223064993a0d193b1f538d9d3d4c587bf",
//         "hash": "ae1e3437dd9be64c30f8bd34158b081b068abb70bb2392c0786425cf06a05a8a205ff657a39fc31cac3c688d971dd40679b70365154bf54e28a163f9454f9881fb23426ff97fb363924e7e7b007b1c2ef36907b893c050dd280f28eba4e8097a0682df13aa9b923e492c748990414fa66252d3b1b5da6847d4bf7cfb0cd50e20ac7306c497dbc3cb1e607d7bc77c4a68db52b6afd1581bba580ac91851db60c7196fc7fa071f4b70ad35266b2150351b14e7831f5c6a321e930ce2de0a23abb4d751ed7980ed6341e02291a1d394a8ac6a79b53cf71e73b294c9ea1660c9b914a2fbc79189009a7647c4ee1f14bb0cd79101354c27f0e9b065026a293cc63c276c67832042669147e7716b7d025484ecc677860d9a3d00b4de19710b69f28eeffb6d91cc9ae72f82029aa5cb36dda6d460214c46e17958c82c6357b24a5ab6b399684af048b527274821fe383a95459ddd06fe8117352bfe2b4a1698d3f97c09abd28aa265c2d667299432c529cec1249e3b9d0935f663689fb6ad68871d16009dafe4c2c11dfd370737df7db86d22d6c6e0da7d62ada0a0f41ba01435dee98aaac333e2b818c0152f287a3a2f645fb33cf72e622c336536ffde9edd9133ea05824185325628b82c72667d94c42d4d50a20220b62c8ee7a7dd9bb68498c7b29f047120f3fc82922902b488f8ca7b80c9c93e38b8c1caaaa21c37a723527e91f9",
//         "__v": 0
//       }])

//     // Youtube Links

//     yt_link.insertMany([{
//         "_id": 1,
//         "title": "anudhina",
//         "link": "https://www.youtube.com/embed/yA1ZM0qPvdA",
//         "__v": 0
//       },
//       {
//         "_id": 2,
//         "title": "hecharika",
//         "link": "https://www.youtube.com/embed/g5Nlk23LLb0",
//         "__v": 0
//       },
//       {
//         "_id": 3,
//         "title": "calvary prathidwani",
//         "link": "https://www.youtube.com/embed/hP2MiXkojiQ",
//         "__v": 0
//       },
//       {
//         "_id": 4,
//         "title": "anudhina_tamil",
//         "link": "https://www.youtube.com/embed/yA1ZM0qPvdA",
//         "__v": 0
//       },
//       {
//         "_id": 5,
//         "title": "anudhina_kannada",
//         "link": "https://www.youtube.com/embed/yA1ZM0qPvdA",
//         "__v": 0
//       }])



// })



app.listen(process.env.PORT, function(){
    console.log("Server is Running");
})






