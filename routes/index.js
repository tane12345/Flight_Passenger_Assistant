var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: res.app.locals.user });
});


router.get("/chat", (req, res) => {
  res.render("chat");
})



router.get("/feedback", (req, res) => {
  res.render("root");
})

module.exports = router;


