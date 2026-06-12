const fs = require('fs');
const path = require('path');
if (fs.existsSync(path.join(__dirname, '../.env'))) {
    try {
        process.loadEnvFile(path.join(__dirname, '../.env'));
    } catch (e) {
        try {
            process.loadEnvFile();
        } catch (err) {}
    }
} else if (fs.existsSync('.env')) {
    try {
        process.loadEnvFile();
    } catch (err) {}
}

const dns = require('dns');
dns.setServers(['8.8.8.8']);
const express = require('express');
const app = express();
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
})
)

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDb().then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
