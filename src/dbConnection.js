const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/users",{
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>
console.log("connect success")
).catch((err)=>console.log(err))