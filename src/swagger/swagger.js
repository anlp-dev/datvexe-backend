const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      {
        url: 'http://127.0.0.1:9999', 
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT' 
        }
      }
    },
    security: [
      {
        bearerAuth: [] 
      }
    ]
  },
  apis: ['../routes/./*.js'] // Thay đổi đường dẫn này cho phù hợp với cấu trúc project của bạn
};

const specs = swaggerJsdoc(options);

module.exports = specs;
