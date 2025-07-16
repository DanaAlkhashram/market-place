const express = require('express');
const router = express.Router()
const Listing = require('../models/listing')

// view new listing form
router.get('/new', (req, res) => {
    res.render('listings/new.ejs')
})

// post form data to database
router.post('/',async(req,res)=>{
    try{
        await Listing.create(req.body)
        res.send('you submitted the form')
    } catch (error){
        console.log(error)
        res.send('Something went wrong')
    }
    
})

// view the index page
router.get('/',async(req,res)=>{
    const foundListings = await Listing.find()
    console.log(foundListings)
    res.render('listings/index.ejs', {foundListings: foundListings})
})

module.exports = router;