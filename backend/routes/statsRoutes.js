const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getByCategory,
  getMonthly,
  getCategoryUsage
} = require('../controllers/statsController');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/monthly', getMonthly);
router.get('/category-usage', getCategoryUsage);


module.exports = router;
