var formidable = require('formidable');
var util = require('util');
module.exports = function (err, req, res, next) {
    if (err) {
        return next(err);
    }
    req.urlData = getUrlData(req);
    req.query = req.urlData.query;
    setFormData(req, next);
};

function getUrlData(req) {
    var url = util.format("http://%s%s", req.headers['host'], req.url);
    return require('url').parse(url, true);
}

function setFormData(req, callback) {
    //解析post请求的form数据
    if (req.method.toLowerCase() == 'get') {
        callback();
    } else {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.parse(req, function (err, fields, files) {
            if (!err) {
                req.form = fields;
                if (files.upload instanceof Array) {
                    req.files = files.upload;
                } else {
                    req.files = [files.upload];
                }
            }
            callback(err);
        });
    }
}
