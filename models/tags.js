var mongoose = require('mongoose');
var TagSchema=mongoose.Schema({
    tag:{
        type:String,
        require:true
    }
})
var Tag=module.exports=mongoose.model('tags',TagSchema);