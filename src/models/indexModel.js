const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const indexSchema = new Schema({

    // Single Field Index:
    username: {type: String},

    // Compound field index:
    firstname: String,
    lastname: String,

    // Multikey Index(array field):
    tags: [String],

    // Text field:
    bio: String,

    // Geospatial:
    location: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: {type: [Number], default: [0, 0]},
    },

    // Partial index:
    isActive: Boolean,
});


// Single field index:
// indexSchema.index({username: 1}, {unique: true});

// Compound Index (firstname + lastname):
indexSchema.index({firstname: 1, lastname: 1});  // 1 for ascending order, -1 for descending order

// Multikey Index (tags):
indexSchema.index({tags: 1});  

// Text index (bio)
indexSchema.index({ bio: "text" });  

// Geospatial 2dsphere index
indexSchema.index({ location: "2dsphere" }); 

// Partial index (only active users)
indexSchema.index({ username: 1 }, { partialFilterExpression: { isActive: true } });

const IndexType = mongoose.model("IndexType", indexSchema);


module.exports = IndexType;