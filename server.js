const express = require('express');
const app = express();
const router = express.Router();
require("dotenv").config();
require("./db/conn");
const cors = require('cors');
const controllers = require("./controllers/dataController");

const PORT = process.env.PORT || "5001";
const API_KEY = process.env.API_KEY;
const ALLOWED_HOST_GOJO = "gojoo.fun";
const ALLOWED_HOST_ZORO = "zorox.fun";
const ALLOWED_HOST_HURAMOVIES = "gojo.streamixz.com";
const ALLOWED_HOST_ANIX = "anixx.fun";
const ALLOWED_HOST_STREAMIXZ = "streamixz.com";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("It's working.😉😎");
}); 

// Middleware to verify API key and host
function verifyRequest(req, res, next) {
  const apiKey = req.query.apikey;

  const host = req.hostname; 
  
  const normalizedHost = host.startsWith('www.') ? host.substring(4) : host;

  const origin = req.get('Origin');
  const originHost = origin ? new URL(origin).hostname : null;
  const normalizedOriginHost = originHost && originHost.startsWith('www.') ? originHost.substring(4) : originHost;

  // Check if API key is valid
  if (apiKey !== API_KEY) {
    return res.status(401).json({ message: "Unauthorized. Invalid API key." });
  }

  // Check if the request is from the allowed host
  if (normalizedHost !== ALLOWED_HOST_ANIX && normalizedOriginHost !== ALLOWED_HOST_ANIX && normalizedHost !== ALLOWED_HOST_GOJO && normalizedOriginHost !== ALLOWED_HOST_GOJO && normalizedHost !== ALLOWED_HOST_ZORO && normalizedOriginHost !== ALLOWED_HOST_ZORO && normalizedHost !== ALLOWED_HOST_HURAMOVIES && normalizedOriginHost !== ALLOWED_HOST_HURAMOVIES && normalizedHost !== ALLOWED_HOST_STREAMIXZ && normalizedOriginHost !== ALLOWED_HOST_STREAMIXZ) {
    return res.status(403).json({ message: "You are quite clever but not more than me. You can't access my database.😉😎" });
  }

  next();
}

router.post("/ajax/v2/upload", verifyRequest, controllers.datapost);
router.get("/ajax/v2/data", verifyRequest, controllers.getData);
router.get("/ajax/v2/releated", verifyRequest, controllers.getReleatedData);
router.get("/ajax/v2/titles", verifyRequest, controllers.getMultipleData);
router.get("/filter", verifyRequest, controllers.advancedatafilter);
router.get("/ajax/v2/popular/:id", verifyRequest, controllers.getonedata);
router.delete("/ajax/v2/delete/:id", verifyRequest, controllers.deletedata);
router.put("/ajax/v2/update/:dataid", verifyRequest, controllers.updatedata);

// Use the router for all routes defined above
app.use("/", router);

app.listen(PORT, () => {
  console.log("Server Started");
});

