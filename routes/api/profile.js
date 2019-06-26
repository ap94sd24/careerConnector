const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

// models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route  GET api/profile/me
 * @desc   Get current user profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this user!' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

/**
 * @route POST api/profile
 * @desc  Create or update user profile
 *  @access Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build profile object
    const profilefields = {};
    profilefields.user = req.user.id;
    if (company) profilefields.company = company;
    if (website) profilefields.website = website;
    if (location) profilefields.location = location;
    if (bio) profilefields.bio = bio;
    if (status) profilefields.status = status;
    if (githubusername) profilefields.githubusername = githubusername;
    if (skills) {
      profilefields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profilefields.social = {};
    if (youtube) profilefields.social.youtube = youtube;
    if (twitter) profilefields.social.twitter = twitter;
    if (linkedin) profilefields.social.linkedin = linkedin;
    if (facebook) profilefields.social.facebook = facebook;
    if (instagram) profilefields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profilefields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route GET api/profile
 * @desc  Get all profile
 *  @access Public
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

/**
 * @route GET api/profile/user/:user_id
 * @desc  Get profile by user id
 *  @access Public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.params.user_id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

module.exports = router;
