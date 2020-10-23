const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const errorMiddleware = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
//config middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

//middleware
app.use(morgan('dev'));
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

//mongo connection
const port = process.env.PORT || 3000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose.connect(
	MONGO_DB_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	(err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('connected');
		}
	},
);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
