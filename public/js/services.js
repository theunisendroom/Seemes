'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])

.factory('AuthService', ['$http', function($http) {
  return {
    login: function(credentials) {
      return $http.post('/api/login', credentials);
    },
    logout: function() {
      return $http.get('/api/logout');
    }
  };
}])

.factory('pagesFactory', ['$http', 
  function($http) {

    return {
      getPages: function() {
        return $http.get('/api/pages');
      },

      savePage: function(pageData) {
        var id = pageData._id;
        
        if (id === "0") {
          return $http.post('/api/pages/add', pageData);
        } else {
          return $http.post('/api/pages/update', pageData);
        }
      },
      deletePage: function(id) {
        return $http.get('/api/pages/delete/' + id);
      },
      getAdminPageContent: function(id) {
        return $http.get('/api/pages/admin-details/' + id);
      },
      getPageContent: function(url) {
        return $http.get('/api/pages/details/' + url);
      },
    };
  }
])

.factory('usersFactory', ['$http', 
  function($http) {

    return {
      getUsers: function() {
        return $http.get('/api/get-users');
      },
      deleteUser: function(id) {
          return $http.get('/api/delete-user/' + id);
      },
      addUser: function(user) {
          return $http.post('/api/add-user', user);
        }
    };
  }
])

.factory('myHttpInterceptor', ['$q', '$location', function($q, $location) {
    return {
        response: function(response) {
            return response;
        },
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/admin/login');
                return $q.reject(response);
            }
            return $q.reject(response);
        }
    };
}]);
