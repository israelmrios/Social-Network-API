const router = require('express').Router();
const { 
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// router.route('/:thoughtId/reactions').post(createReaction);

router.route('/:thoughtId/reactions/:reactionId').post(createReaction).delete(removeReaction);

module.exports = router