const { check } = require('express-validator');

exports.validateRegistration = [
    check('fullName', 'Full name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('mobileNumber', 'A valid mobile number is required').not().isEmpty().isMobilePhone('any'),
    check('gender', 'Gender is required').optional().not().isEmpty(),
];

exports.validateLogin = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
];

exports.validateCompanyProfile = [
    check('companyName', 'Company name is required').not().isEmpty().trim().escape(),
    check('companyAddress', 'Company address is required').not().isEmpty().trim().escape(),
    check('companyCity', 'City is required').not().isEmpty().trim().escape(),
    check('companyState', 'State is required').not().isEmpty().trim().escape(),
    check('companyZip', 'ZIP code is required').not().isEmpty().isPostalCode('any'),
    check('companyCountry', 'Country is required').not().isEmpty().trim().escape(),
    check('companyLogoUrl', 'Must be a valid URL').optional({ checkFalsy: true }).isURL(),
    check('companyBannerUrl', 'Must be a valid URL').optional({ checkFalsy: true }).isURL(),
];
