/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ "./app/assets/es6/pages/pricing.js":
      /*!*****************************************!*\
  !*** ./app/assets/es6/pages/pricing.js ***!
  \*****************************************/
      /***/ () => {
        eval(
          "class PagesPricing {\r\n\r\n    static init() {\r\n\r\n        $('#monthly-btn').on('click', (e) => {\r\n            $('#monthly-view').removeClass('d-none');\r\n            $('#annual-view').addClass('d-none')\r\n            $(e.currentTarget).addClass('active');\r\n            $('#annual-btn').removeClass('active');\r\n        })\r\n\r\n        $('#annual-btn').on('click', (e) => {\r\n            $('#annual-view').removeClass('d-none');\r\n            $('#monthly-view').addClass('d-none');\r\n            $(e.currentTarget).addClass('active');\r\n            $('#list-view-btn').removeClass('active');\r\n        })\r\n    }\r\n}\r\n\r\n$(() => { PagesPricing.init(); });\r\n\r\n\n\n//# sourceURL=webpack://aism/./app/assets/es6/pages/pricing.js?"
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module can't be inlined because the eval devtool is used.
  /******/ var __webpack_exports__ = {};
  /******/ __webpack_modules__["./app/assets/es6/pages/pricing.js"]();
  /******/
  /******/
})();