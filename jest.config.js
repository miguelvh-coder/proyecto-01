// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
  };

//usar: "npx jest" para instalaer jest
//usar: "npm install mongoose" para instalaer mongoose

//  3U  //
//usar: "npx jest test/unit/action/Book_Action.test.js" para ejectuar Book_Action.test.js
//usar: "npx jest test/unit/controlador/Order_Controller.test.js" para ejectuar Book_Action.test.js
//usar: "npx jest test/unit/Routes/Book_Route.test.js" para ejectuar Book_Action.test.js

// 2 integracion //
//usar: "npx jest test/integration/Action-Controller-Action/Book_ACA.test.js" para ejectuar Book_Action.test.js
//usar: "npx jest test/integration/Route-Controller-Route/Book_RCR.test.js" para ejectuar Book_Action.test.js


// 1 de E2E  //
//usar: "npx jest test/End-to-End/Book_E2E.test.js" para ejectuar Book_Action.test.js
  