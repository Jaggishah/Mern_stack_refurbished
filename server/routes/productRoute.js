const router = require('express').Router();
const Product = require('../models/productModel');
const authMidlleware = require('../middlwares/authMiddleware');
const cloudinary_js_config  = require('../config/cloudinaryConfig');
const multer = require('multer');
// add new product

router.post('/addproduct',authMidlleware,async (req,res)=>{
    try{
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send({
            success:true,
            message: "Product added Succesfully"
        });

    }catch(error){
        res.send({
            success : false,
            message : error.message
        })

    }
})

// get all products
router.post('/getproducts',async (req,res) => {
    try{
        const {seller, categories=[],age=[]} = req.body
        let filters = {}
        if (seller){
            filters.seller = seller
        }
        const products = await Product.find(filters).populate('seller').sort({createdAt:-1});
        
        res.send({
            success:true,
            products,
        })

    }catch(error){
        res.send({
            success:false,
            message:error.message,
        })
    }
})

// edit a product
router.put("/edit-product/:id",authMidlleware, async (req, res) => {
    try{
        await Product.findByIdAndUpdate(req.params.id,req.body);
        res.send({
            success:true,
            message:"product Updated successfully"
        })
    }catch(error){
        res.send({
            success:false,
            message: error.message,
        })
    }
})

// delete a product
router.delete("/delete-product/:id",authMidlleware, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id,req.body);
        res.send({
            success:true,
            message:"product deleted successfully"
        })
    }catch(error){
        res.send({
            success:false,
            message: error.message,
        })
    }
});

// handle image upload to cloudinary

const storage = multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,Date.now()+file.originalname)
    }
})

router.post('/upload-image-to-product',authMidlleware,multer({storage:storage}).single('file'),async(req,res)=>{
    try{
        const result = await cloudinary_js_config.uploader.upload(req.file.path);
        const productId = req.body.productId;
        await Product.findByIdAndUpdate(productId,{
            $push :{images: result.secure_url},
        });
        res.send({
            success:true,
            message:"image upload successfully",
            data : result.secure_url,
        })
    }catch(error){
        success:false
        message:error.message

    }
});

// update product status
router.put('/update-product-status/:id',authMidlleware, async (req,res)=> {
    try{
        const { status } = req.body
        await Product.findByIdAndUpdate(req.params.id,{status})
        res.send({
            success:true,
            message: "product status updated Successfully"

        });}catch(error){
            res.send({success:false,
            message:error.message
        });
        }
})


module.exports = router;