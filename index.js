const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const basicAuth = require("express-basic-auth");
const { router } = require("./routes/app.routes");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/employ",
  {
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true
  }
  
).then(console.log("DB connected"))




app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "My apis in swaager",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8082",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("Hello");
});


app.listen(8082, () => console.log(`Server is running on port 8082`));
