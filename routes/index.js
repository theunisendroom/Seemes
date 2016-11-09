var express = require('express');
var router = express.Router();

router.get('*', function(request, response) {
    response.sendfile('./public/index.html');
});

module.exports = router;
