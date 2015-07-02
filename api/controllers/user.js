// Load required packages
var User = require('../models/user');

function cleanse(user) {
  user = user.toObject();
  delete user["_id"];
  delete user["password"];
  return user;
}

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json(cleanse(user));
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

// Create endpoint /api/users/:username for GET
exports.getUser = function(req, res) {
  // Use the Beer model to find a specific beer
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err)
      res.send(err);


    res.json(cleanse(user));
  });
};

// Create endpoint /api/users/:username for DELETE
exports.deleteUser = function(req, res) {
  // Use the User model to find a specific user and remove it
  User.remove({ _id: req.user._id }, function(err) {
    if (err)
      res.send(err);

    res.json(true);
  });
};
