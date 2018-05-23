const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {
  describe('/firstRoute', () => {
    
    beforeEach(() => {
      return seedDB()
      .then((commentDocs) => {
        console.log(`Database sucessfully seeded with ${commentDocs.length} comment docs`)
      })
    });
    
    it('api', () => {
      
    });

    after(() => {
      return mongoose.disconnect()
      .then(() => console.log('Sucessfully disconnected from test DB'))
    })

  });
});

