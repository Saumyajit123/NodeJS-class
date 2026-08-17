const express = require('express');
const IndexController = require("../../controller/APIs/indexController");
const router = express.Router();


// Create index
router.post('/createIndex', IndexController.creatIndex);

// Find by username:
router.get('/users/username/:username', IndexController.getIndex);

// Compound index:
router.get('/users/name', IndexController.compoundIndexes);

// Text index:
router.get('/users/search/:keyword', IndexController.textIndex);

// Geospatial index:
router.get('/users/near', IndexController.geospatialIndex);

// Partial index:
router.get('/users/active', IndexController.partialIndex);



module.exports = router;
