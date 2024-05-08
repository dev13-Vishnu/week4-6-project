const mongoose = require ("mongoose")
mongoose.connect("mongodb://localhost:27017/week4_6Project",{useNewUrIParser:true,useUnifiedTopology:true})
.then(() => {
    console.log("MongoDb connected");
}).catch(() => {
    console.log("failed to connect");
});

module.exports = mongoose;