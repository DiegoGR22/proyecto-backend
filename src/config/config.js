import "dotenv/config"

export default {
    mongoUri: process.env.MONGODB_URI,
    port: process.env.PORT1,
    passportKey: process.env.SECRET_KEY
}