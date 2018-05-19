const app = require('express')();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { mongoEndpoint } = require('./config');

const production = process.env.NODE_ENV === 'production';

mongoose.connect(mongoEndpoint);

if (production) app.use(morgan('combined'));
else app.use(morgan('dev'));

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

// Routes
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
});

// Status code for validation error
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  if (err.name === 'ValidationError') err.status = 422;
  next(err);
});

if (!production) {
  // Error-handling middleware always takes four arguments.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.log(err.stack); // eslint-disable-line no-console

    const response = {
      errors: {
        message: err.message,
        error: err,
      },
    };

    res.status(err.status || 500).json(response);
  });
}

// production error handler
// Error-handling middleware always takes four arguments.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const response = {
    errors: {
      message: err.message,
      error: {},
    },
  };

  res.status(err.status || 500).json(response);
});

const port = process.env.PORT || 3000;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Express server port is ${port}`));
