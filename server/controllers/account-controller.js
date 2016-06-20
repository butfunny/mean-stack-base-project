var jwt = require('jsonwebtoken');
var $q = require('q');


module.exports = function (injector) {
  injector
      .run(function (apiRouter, Security, UserDao) {

          var createSecurityToken = function (userData) {
              return jwt.sign(userData, /* jwtSecret */ '23f34g1234yg1345yg13',{
                  expiresIn: 1440
              });
          };

          var verifyToken = function (token) {
              var defer = $q.defer();
              jwt.verify(token, /* jwtSecret */  '23f34g1234yg1345yg13', function (err, decodedAuth) {
                  defer.resolve(decodedAuth);
              });
              return defer.promise;
          }

      })
};