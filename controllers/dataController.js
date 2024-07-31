const dataJson = require('../models/dataSchema');

exports.datapost = async (req, res) => {
    try {
        const dataArray = req.body;

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ error: "Invalid data format." });
        }

        const insertedData = await dataJson.insertMany(dataArray, { ordered: false });

        res.status(200).json(insertedData);
    } catch (error) {
        console.error("Error inserting documents:", error);

        if (error.code === 11000) {
            return res.status(200).json({ message: "Some IDs already exist in the database." });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};




//   get movies 


exports.getData = async (req, res) => {
    try {
        // Fetch all data in descending order of _id field (assuming _id is the unique identifier for your documents)
        const allData = await dataJson.find().sort({ _id: -1 }).exec();

        res.status(200).json({
            success: 200,
            totalResults: allData.length,
            results: allData,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getReleatedData = async (req, res) => {
    try {
        const seasonID = req.query.id;

        // Find all documents that match the given season_id
        const matchingData = await dataJson.find({ season_id: seasonID }).sort({ _id: -1 }).exec();

        res.status(200).json({
            success: 200,
            totalResults: matchingData.length,
            results: matchingData,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// get multitle id data from database 

exports.getMultipleData = async (req, res) => {
    try {
        // Extract embed_titles from query parameters
        const titles = req.query.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const titleArray = Array.isArray(titles) ? titles : [titles];

        const totalResults = await dataJson.countDocuments({ embed_title: { $in: titleArray } });

        const totalPages = Math.ceil(totalResults / limit);

        const results = await dataJson.find({ embed_title: { $in: titleArray } })
            .sort({ embed_title: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.status(200).json({
            success: true,
            totalPages,
            results,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




// advance filter 


exports.advancedatafilter = async (req, res) => {
    const keyword = req.query.keyword || "";
    const letter = req.query.letter || "";
    const genre = req.query.genre || "";
    const country = req.query.country || "";
    const premiered = req.query.premiered || "";
    const year = req.query.year || "";
    const type = req.query.type || "";
    const status = req.query.status || "";
    const rating = req.query.rating || "";
    const age_rating = req.query.age_rating || "";
    const studios = req.query.studios || "";
    const language = req.query.language || "";

    const genreArray = Array.isArray(genre) ? genre : [genre];
    const languageArray = Array.isArray(language) ? language : [language];
    const ratingMin = rating.toString();
    const ratingMax = (parseInt(rating) + 1).toString();

    const newMatchLetter = letter?.slice(0, 1);

    // Normalize keyword by replacing spaces with regex to match any special characters in the database
    const normalizedKeyword = keyword.replace(/[-,;'"!]/g, '').replace(/\s+/g, '[\\s-]*');
    const keywordRegex = new RegExp(normalizedKeyword, 'i');

    const new_age_rating = age_rating?.replace(/-/g, ' ')?.toUpperCase();

    let final_age_rating;
    if (new_age_rating === "RPLUS") {
        final_age_rating = "R+";
    } else {
        final_age_rating = new_age_rating;
    }

    const query = {
        $or: [
            { embed_title: { $regex: keywordRegex } },
            { embed_title: { $regex: keyword } },
            { other_title: { $regex: keywordRegex } },
            { title: { $regex: keywordRegex } }
        ],
        title: { $regex: `^${newMatchLetter}`, $options: "i" },
        genre: { $all: genreArray.map(g => new RegExp(g, 'i')) },
        country: { $regex: country, $options: "i" },
        premiered: { $regex: premiered, $options: "i" },
        date: { $regex: year, $options: "i" },
        type: { $regex: type, $options: "i" },
        status: { $regex: status, $options: "i" },
        studios: { $regex: studios, $options: "i" },
        rating: { $gte: ratingMin, $lt: ratingMax },
        language: { $in: languageArray.map(g => new RegExp(g, 'i')) },
    };

    if (final_age_rating) {
        query.new_rating = final_age_rating;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 20);
    const skip = (page - 1) * limit;

    try {
        const totalDocs = await dataJson.countDocuments(query);
        const totalPages = Math.ceil(totalDocs / limit);

        const results = await dataJson.find(query).skip(skip).limit(limit).sort({ $natural: 1 });

        res.status(200).json({
            success: true,
            totalPages,
            results,
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        console.log("Error:", error);
    }
};









// get data by id 


exports.getonedata = async (req, res) => {

    const { id } = req.params;

    try {

        const getOneData = await dataJson.findOne({ id: id })

        res.status(200).json({
            success: true,
            getOneData
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}


// delete user 


exports.deletedata = async (req, res) => {

    const { id } = req.params;

    try {

        const deletedatabyid = await dataJson.findByIdAndDelete({ _id: id })

        res.status(200).json({
            success: true,
            deletedatabyid
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}



// // update data 

exports.updatedata = async (req, res) => {

    const { dataid } = req.params;

    const { id, title, other_title, embed_title, sposter, bposter, type, duration, country, episodes, hindidub, subtitle, dubbed, description, date, genre, status, premiered, language, studios, rating, new_rating, plus18, producers } = req.body;

    try {

        const updatedatabyid = await dataJson.findByIdAndUpdate({ _id: dataid }, {
            id, title, other_title, embed_title, sposter, bposter, type, duration, country, episodes, hindidub, subtitle, dubbed, description, date, genre, status, premiered, language, studios, rating, new_rating, plus18, producers
        }, { new: true })

        await updatedatabyid.save()

        res.status(200).json({
            success: true,
            updatedatabyid
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}
