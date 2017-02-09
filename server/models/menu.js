var mongoose = require('mongoose');
var MenuSchema = mongoose.Schema({
    name : {
        type : String
    },    
});

var Menu = module.exports = mongoose.model('Menu',MenuSchema);

/**Create Menu and save */
module.exports.createMenu = function(newMenu,callback){
    newMenu.save(callback);
};

/**Get List Menu */
module.exports.getMenu = function(callback){
    Menu.find(callback);
};

/**Find Id Menu */
module.exports.findIdMenu = function(id,callback){
    Menu.findById(id,callback);
};

/**Delete Menu */
module.exports.deleteMenu = function(id,callback){
    var query = { _id : id};
    Menu.findOneAndRemove(query,callback);
};