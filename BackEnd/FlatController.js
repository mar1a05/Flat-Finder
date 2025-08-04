const Flat = require("./FlatModel");
const User = require('./UserModel');

exports.createFlat = async(request, response) => {
    // try{
    //     let newProduct = await Product.create(request.body);
    //     response.status(201).json({status: "success", data: newProduct})
    // }catch(err){
    //     response.status(400).json({status: "failed", message: err.message});
    // }


    try{
        const currentUser = request.currentUser;
        const newFlat = await Flat.create({
            ...request.body,
            createdBy: currentUser.id
        })

        await User.findByIdAndUpdate(currentUser.id, {
            $push: {flats: newFlat._id}
        })

        const populatedFlat = await Flat.findById(newFlat._id).populate('createdBy', 'email password')

        return response.status(201).json({status: "success", data: populatedFlat})
    }catch(err){
        return response.status(400).json({status: "failed", message: err.message});
    }
}

exports.getAllFlats = async(request, response) => {
    try{
        let flats = await Flat.find().populate({path: 'messages', select: 'contents createdAt userId'});
        response.status(200).json({status: "succes", data: flats, noOfFlats: flats.length})
    }catch(err){
        response.status(400).json({status: "failed", message: err.message});
    }
}

exports.getFlatById = async(request, response) => {
    try{
        let id = request.params.id;
        let flat = await Flat.find({_id: id});
        // let flat = await Flat.findById(id);
        console.log(flat)
        if (!flat) {
            return response.status(404).json({ message: "Flat not found" });
        }
        response.status(200).json({status: "success", data: flat});

    }catch(err){
        response.status(400).json({status: "failed", message: err.message});
    }
}

exports.updateFlat = async(request, response) => {
    try{
        let id = request.params.id;
        let updatedFlat = await Flat.findByIdAndUpdate(id, request.body.data, {new: true, runValidators: true});
        response.status(201).json({status: "success", data: updatedFlat});
    }catch(err){
        response.status(400).json({status: "failed", message: err.message});
    }
}

exports.deleteFlat = async(request, response) => {
    try{
        let id = request.params.id;
        await Flat.findByIdAndDelete(id);
        response.status(200).json({status: "succes", data: "Deleted succesfully."});
    }catch(err){
        response.status(400).json({status: "failed", message: err.message});
    }
}


exports.getFavouriteFlats = async(req, res) => {
    try{
        let id = req.currentUser._id;
        // console.log(req.currentUser);
        const responseIds = await User.findById(id, {favouriteFlats: 1, _id: 0});
        const favFlatsIds = responseIds.favouriteFlats;
        const favouriteFlats = await Flat.find({_id: {$in: favFlatsIds}});
         

        res.status(200).json({status: "success", data: favouriteFlats});
    }catch(err){

    }
}


//new: true => intoarce obiectul/documentul updatat
//runValidators: true => aplica validatorii aferenti schemei si pe valori noi.


//Aggregate => este o modalitate de a efectua operatii pe datele stocate in baza(colectii) pentru a obtine niste rezultate sau statistici. Calcule matematice,grupari de date. 
//Intr-un proces de agregare putem defini unul sau mai multe stadii/etape => intr-un array. 

//$match => ne permite sa alegem cu ce date vrem sa lucram => filtrare in functie de o anumita conditie data de noi. 
//$group => ne permite sa executam operatiuni precum numarare, adunare, scadere, inmultire, impartire, medie + grupari
//$sort => ne permite sa sortam produsele in functie de un anumit parametru.
//$project => ne permite sa pasam date cu fielduri specifice in stagiu urmatorul.


// exports.getStats = async(request, response) => {
//     try{
//         const stats = await Product.aggregate([
//             {$match: {price: {$gt: 0}}},
//             {$group: {
//                 "_id": null,
//                 averagePrice: {$avg: '$price'},
//                 minPrice: {$min: '$price'},
//                 maxPrice: {$max: '$price'},
//                 sumPrice: {$sum: '$price'},
//                 totalProducts: {$sum: 1}
//             }},
//             //{$sort: {minPrice: -1}},
//             {$project: {_id: 0, averagePrice: 1, minPrice: 1, maxPrice: 1, sumPrice: 1, totalProducts: 1}}
//         ])

//         response.status(200).json({status: "success", data: stats});       
//     }catch(err){
//         response.status(400).json({status: "failed", message: err.message});
//     }
// }

// exports.groupingProductsByYear = async(request, response) => {
//     try{
//         const result = await Product.aggregate([
//             {$project: {
//                 yearCreated: { $year: { $toDate: "$created" } }, //2024, 2002, 1999, 2024, 2002
//                 title: 1
//             }},
//             {$group: {
//                 _id: "$yearCreated",
//                 count: {$sum: 1},
//                 products: {$push: '$title'}
//             }},
//             {$sort: {_id: -1}}
//         ])

//         response.status(200).json({status: "success", data: result});
//     }catch(err){
//         response.status(400).json({status: "failed", message: err.message});
//     }
// }
