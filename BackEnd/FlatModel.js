const mongoose = require("mongoose");
const template = mongoose.Schema;
const FlatSchema = new template({
    city: {
        type: String,
        required: [true, "A flat must have a city."],
        validate: {
            validator: function(value){
                return /^[A-Z]/.test(value);
            },
            message: "The city must start with an uppercase."
        }
    },
    // description: {
    //     type: String,
    //     required: [true, "A product must have a description."],
    //     minlength: [5, "Description must have at least 5 characters."],
    //     maxlength: [30, "Description must have maximum 30 characters."],
    //     validate: {
    //         validator: function(value){
    //             const words = ["banned", "prohibited", "restricted"];
    //             return !words.some(word => value.includes(word));
    //         },
    //         message: "The description contains banned words. "
    //     }
    // },
    streetName: {
        type: String,
        required: [true, "A flat must have a street name."]
    },
    streetNumber: {
        type: Number,
        required: [true, "A flat must have a street number."]
    },
    areaSize: {
        type: Number,
        required: [true, "A flat must have an area size."]
    },
    hasAC: {
        type: Boolean
    },
    yearBuilt: {
        type: Number,
        required: [true, "A flat must have a build year."]
    },
    price: {
        type: Number,
        required: [true, "A flat must have a rent price."],
    },
    dateAvailable: {
        type: Date,
        required: [true, "A flat must have an availability date."]
    },
    created: {
        type: Date,
        validate: {
            validator: function(value){
                return value <= new Date();
            },
            message: "The created date must be in the past"
        },
        default: Date.now()
    },
    updated: Date,
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'messages'
        }
    ]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

FlatSchema.pre(/^find/, function(next){
    this.populate({path: 'createdBy', select: 'email'})
    next();
})

// FlatSchema.pre("save", function(next){
//     console.log("Document is in pending.");
//     next();
// })

FlatSchema.post("save", function(doc, next){
   console.log("A new document was created", doc);
   next(); 
})

FlatSchema.virtual("priceAfterDiscount").get(function(){
    return this.price - (this.price * 0.10); 
});


module.exports = mongoose.model("flats", FlatSchema);



//Virtual Properties - reprezinta fielduri/proprietati ce le putem defini pe schema insa ele nor vor aparea in mongodb, nu vor fi persistente. De regula, sunt folosite ca derivate de la un field existent. 