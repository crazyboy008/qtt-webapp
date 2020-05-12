var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var BannerSchema = new Schema({
    id: String,
    title: String,
    img: String,
  });

mongoose.model('Banner', BannerSchema, 'banner');
