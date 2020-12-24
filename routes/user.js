const express = require('express');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const User = require('../model/User')

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
    try{
        const result = await cloudinary.uploader.upload(req.file.path);

        // create instance of user
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        })

        // Save user
        await user.save();
        res.status(201).json({
            success: true,
            data: user
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'image cannot be uploaded! Server error.'
        })
    }
})

// get all images
router.get('/', async (req, res) => {
    try{
        let user = await User.find();
        res.json(user)
    }catch(err){
        console.log(err);
    }
})


// get image by id
router.get('/:id', async (req, res) => {
    try{
        let user = await User.findById(req.params.id);
        res.status(200).json(user)
    }catch(err){
        console.log(err);
    }
})

// update image 
router.put('/:id', upload.single("image"), async(req, res) => {
    try{
        let user = await User.findById(req.params.id);

        await cloudinary.uploader.destroy(user.cloudinary_id);

        const result = await cloudinary.uploader.upload(req.file.path);

        const data = {
            name: req.body.name || user.name,
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id,
        };

        user = await User.findByIdAndUpdate(req.params.id, data, {new: true});

        res.status(200).json({
            success: true,
            data: user
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Server error! image cannot be updated.'
        })
    }
})

// delete image
router.delete('/:id', async(req, res) => {
    try{
        // Find user by id
        let user = await User.findById(req.params.id);

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);

        // Delete user from db
        await user.remove();
        res.status(200).json({
            success: true,
            user: {}
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Server error! image cannot be deleted.'
        })
    }
})



module.exports = router;