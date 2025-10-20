express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authJwt');
const {
  createPerson, getPersons, getPersonById, updatePerson, deletePerson
} = require('../controller/personCotroller');

router.post('/', verifyToken, createPerson);
router.get('/', verifyToken, getPersons);
router.get('/:id', verifyToken, getPersonById);
router.put('/:id', verifyToken, updatePerson);
router.delete('/:id', verifyToken, deletePerson);

module.exports = router;