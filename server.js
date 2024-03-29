const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URL;
mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, goose) => {
    if (err) console.log("ERROR on connection MongoDB", err);
    else {
      console.log("MongoDB connection success");

      const server = require("./App");

      let PORT = process.env.PORT || 3007;
      server.listen(PORT, () => {
        console.log(
          `The server is running successfully on port: ${PORT}, http://localhost:${PORT}`
        );
      });
    }
  }
);
