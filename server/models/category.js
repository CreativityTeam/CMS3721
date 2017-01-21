var mongoose = require('mongoose');
var CategorySchema = mongoose.Schema({
    mainCategory : {
        type : String
    },
    name : {
        type : String
    },    
});

var Category = module.exports = mongoose.model('Category',CategorySchema);

/**Create Category and save */
module.exports.createCategory = function(newCategory,callback){
    newCategory.save(callback);
};

/**Get category */
module.exports.getCategory = function(id,callback){
    Category.findById(id,callback)
};

/**Get List category */
module.exports.getListCategory = function(callback){
    Category.find(callback)
};