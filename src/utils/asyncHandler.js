// promise method

const asyncHandler = ( requestHandler)=>{
    (req, res, next)=>{
        Promise.resolve(resolveHandler(req,res, next)).
        catch((err)=> next(err))
    }
}

export {asyncHandler}


// try catch method

// const asyncHandler = (fn) => async ( req, res, next)=>{
//     try{
//         await fn(req, res, next)
//     }
//     catch{
//         res.status(error.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }