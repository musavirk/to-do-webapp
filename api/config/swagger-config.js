import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    description: 'API for betasquirrel CRM',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/v1`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../routes/*.js'),
    path.resolve(__dirname, '../controllers/*.js'),
    path.resolve(__dirname, './swagger-components.yaml'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
