const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')
const isSignedIn = require('../middleware/is-signed-in')


// VIEW NEW LISTING FORM
router.get('/new', isSignedIn, (req, res) => {
    res.render('listings/new.ejs')
})

// POST FORM DATA TO DATABASE
router.post('/', isSignedIn, async (req, res) => {
    try {
        req.body.seller = req.session.user._id
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

// VIEW THE INDEX PAGE
router.get('/', async (req, res) => {
    const foundListings = await Listing.find()
    console.log(foundListings)
    res.render('listings/index.ejs', { foundListings: foundListings })
})

// VIEW A SINGLE LISTING (SHOW PAGE)
router.get('/:listingId', async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('seller')
    // console.log(foundListing)
    // console.log(req.session.user._id)
    // console.log(foundListing.seller._id.equals(req.session.user))

    res.render('listings/show.ejs', { foundListing: foundListing })
})

// DELETE LISTING FROM DATABASE
router.delete('/:listingId',async(req, res)=>{
    // req.params -->
    // req.body   -->
    // res.send(`You deleted ${req.params.listingId}`)

    // find the listing 
    const foundListing = await Listing.findById(req.params.listingId).populate('seller')
    // check if the logged in user owns th listing
    if(foundListing.seller._id.equals(req.session.user._id)){
        // delete and redirect to listing
        await foundListing.deleteOne()
        res.redirect('/listings')
    } 
    return res.send('Not authorized')
})

module.exports = router