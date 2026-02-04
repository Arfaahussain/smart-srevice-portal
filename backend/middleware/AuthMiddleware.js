import jwt from "jsonwebtoken";

const getToken = (req) => {
  const authHeader = req.headers["authorization"] || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7);
  }
  return authHeader;
};

export function authMiddleware(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json("No token provided");
  }

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth token error:", err);
    res.status(401).json("Invalid token");
  }
}

export function requireAdmin(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json("Admin access required");
    }
    next();
  });
}

export default authMiddleware;
