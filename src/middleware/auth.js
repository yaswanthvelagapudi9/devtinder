const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
    console.log("Admin Authorized");
  }
};

const userAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
    console.log("Admin Authorized");
  }
};

module.exports = { adminAuth, userAuth };
