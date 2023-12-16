const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((error) => next(error))
    }
}



export {asyncHandler}

// higher order function
// those functions that can be considered as variables
// as well as executed as functions

// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => async () => {}

// TRY-CATCH approach to handle errors
// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }