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

myApp.service("user", function() {
    //this.currentUser = [];
    this.currentUser = '';
    this.cart = [];
    this.addToCart = function(newCartObject) {
        this.cart.push(newCartObject);
        console.log(this.cart);
    }
});

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
    .controller("MainCtrl", ["user", "$firebaseAuth","$scope", function(user, $firebaseAuth, $scope) {
        var ref = new Firebase("https://glaring-inferno-9704.firebaseio.com");
        $scope.authObj = $firebaseAuth(ref);
        var authData1 = $scope.authObj.$getAuth();
        if (authData1) {
            user.currentUser = authData1.uid;
            console.log(user.currentUser);
        } else {
            ref.authAnonymously(function(error, authData) {
                if (error) {
                    console.log(error);
                } else {
                    authData1 = authData;
                    user.currentUser = authData1.uid;
                    console.log(user.currentUser);
                }
            }, {
                remember: 'sessionOnly'
            });
        }
    }])
    .controller("OrdersCtrl", ["$scope", "$http", function($scope, $http) {
       
        $http.get("data/products.json").then(function(response) {
            $scope.beans = response.data;
        });   
    }])
    .controller("BeanCtrl", ["$scope", "$stateParams", "$http", "$filter", "user", function($scope, $stateParams, $http, $filter, user) {
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
        $scope.cartObject = {};
        $scope.newItem = {};
        $scope.getBeanAndPrice = function(bean, price) {
            $scope.newItem.push({
                bean = bean,
                price = price,
                grind: $scope.cartObject.grind,
                quantity: $scope.cartObject.quantity
            });
            console.log($scope.newItem);
        };
        $scope.addToCart = user.addToCart($scope.newItem);
        
    }]);
    // .controller("CartCtrl", ["$scope", "$http", "$firebaseArray", "$firebaseObject", function($scope, $http, $firebaseArray, $firebaseObject) {
        
    // }]);