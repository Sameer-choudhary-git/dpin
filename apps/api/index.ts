import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.json({ message: 'API Service Running' });
});

app.use(express.json());
require("./routes/index")(app);
