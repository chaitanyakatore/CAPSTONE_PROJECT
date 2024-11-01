"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const designController_1 = require("../controllers/designController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Define storage for uploaded files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(__dirname, '../../uploads'); // Adjust the path as needed
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
// Endpoint to create a new design
router.post('/', upload.single('designInput'), (req, res) => (0, designController_1.createDesign)(req, res));
// Endpoint to get all designs
router.get('/', (req, res) => (0, designController_1.getDesigns)(req, res));
// Endpoint to get designs by a specific user ID
router.get('/user/:userId', (req, res) => (0, designController_1.getDesignsByUserId)(req, res));
exports.default = router;
