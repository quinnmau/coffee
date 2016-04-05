// "use strict";

// var app1 = angular.module("app1", ["ngSanitize", "ui.router"]);

// app1.config(function($stateprovider, $urlRouterProvider) {
//     $urlRouterProvider.otherwise("/");
//     $stateprovider
//         .state("home", {
//             url: "/home",
//             templateUrl: "partials/home.html"
//         })
        
//         .state("order", {
//             url: "/order",
//             templateUrl: "partials/order.html"
//         })
        
//         .state("cart", {
//             url: "/cart",
//             templateUrl: "partials/cart.html"
//         })
        
//         .state("details", {
//             url: "/bean/{id}",
//             templateUrl: "partials/bean.html"
//         });
// })
// .controller("MyCtrl", function($scope) {
//     $scope.first = 1;
// });

'use strict';


var myApp = angular.module('dawgApp', ['ngSanitize', 'ui.router', 'firebase']);

myApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "partials/home.html"
        })
        .state('cart', {
          url: "/cart",
          templateUrl: "partials/cart.html"
        })
        .state('detail', {
          url: "/bean/{id}",
          templateUrl: "partials/bean.html"
        })
        .state('order', {
          url: "/order",
          templateUrl: "partials/order.html"
        });
    })
    .controller("OrdersCtrl", ["$scope", "$http", function($scope, $http) {
       
        $http.get("data/products.json").then(function(response) {
            $scope.beans = response.data;
        });  
        
        var ref = new Firebase("https://glaring-inferno-9704.firebaseio.com");
        
        ref.authAnonymously(function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        }); 
    }])
    .controller("BeanCtrl", ["$scope", "$stateParams", "$http", "$filter", "$firebaseArray", "$firebaseObject", "$firebaseAuth", function($scope, $stateParams, $http, $filter, $firebaseArray, $firebaseObject, $firebaseAuth) {
        $scope.iden = $stateParams.id;
        
        $scope.grinds = ["Whole Bean", "Espresso", "French Press", "Cone Drip", "Filter", "Flat Bottom filter"];
        $scope.grind = "Whole Bean";
        $scope.quantity = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.quant = "1";
        
        $http.get("data/products.json").then(function(response) {
            $scope.bean = $filter("filter")(response.data, {
                id: $scope.iden
            }, true)[0];
        });
        
        
        /*var users = ref.child('users');
        $scope.users = $firebaseObject(users);
        
        $scope.authObject = $firebaseAuth(ref);
        var authData = $scope.authObject.$getAuth();
        
        if (authData) {
            $scope.userId = authData.uid;
        }
        ref.authAnonymously(function(error, authData) { console.log(authData.uid) }, {
            remember: "sessionOnly"
        });*/
        
        
    }]);
    // .controller("CartCtrl", ["$scope", "$http", "$firebaseArray", "$firebaseObject", function($scope, $http, $firebaseArray, $firebaseObject) {
        
    // }]);