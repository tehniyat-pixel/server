import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import sequelize from './sequelize.js';
import Asset from './models/Asset.js';
import assetRoutes from './routes/assets.js';
import cors from 'cors';

AdminJS.registerAdapter(AdminJSSequelize);
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin:  'https://asset-management-frontend-one.vercel.app/',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// AdminJS config
const adminJs = new AdminJS({
  resources: [Asset],
  rootPath: '/admin',
});
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

// Your API routes
app.use('/api/assets', assetRoutes);

// Connect DB and Start Server
const PORT = process.env.PORT;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
