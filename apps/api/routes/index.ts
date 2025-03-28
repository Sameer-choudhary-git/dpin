import { type Application } from "express";

const { authMiddleware, makeWebsite, getWebsiteStatus, getWebsites, deleteWebsite ,payOut} = require("../controller");
module.exports = (app:Application) => {
  app.post("/api/v1/website",[authMiddleware], makeWebsite);
  app.get("/api/v1/websites",[authMiddleware], getWebsites);
  app.get("/api/v1/website/status", [authMiddleware], getWebsiteStatus  );
  app.delete("/api/v1/website/:websiteId", [authMiddleware], deleteWebsite);
  app.post("/api/v1/payout/:validatorId",  payOut);
}
