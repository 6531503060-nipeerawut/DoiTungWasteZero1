require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    cookie: { secure: false }
}));

app.use("/", require("./routes/pages"));
app.use("/v", require("./routes/villager"));
app.use("/c", require("./routes/collector"));
app.use("/admin", require("./routes/admin"));

app.use((req, res, next) => {
    res.status(404).json({ message: 'ไม่พบหน้าที่คุณต้องการ (404)' });
});

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});