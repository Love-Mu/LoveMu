//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });

    /*
  * Test the /POST route
  */
  describe('/POST registration', () => {
    it('it should POST a new user with the provided details', (done) => {
        let usr = {
            email: 'test@user.com',
            password: "TestPassPass"
        }
      chai.request(server)
          .post('/auth/register')
          .send(usr)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.eql("Successful Login!");
            done();
          });
    });

});

describe('/POST registration', () => {
    it('it should not POST a bad email', (done) => {
        let usr = {
            email: 'testuser.com',
            password: "TestPassPass"
        }
      chai.request(server)
          .post('/auth/register')
          .send(usr)
          .end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                res.body.errors.should.deep.equal([ { email: 'Invalid value' } ]);
            done();
          });
    });

});

describe('/POST registration', () => {
    it('it should not POST a bad password', (done) => {
        let usr = {
            email: 'test@user.com',
            password: "Tes"
        }
      chai.request(server)
          .post('/auth/register')
          .send(usr)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('errors');
            res.body.errors.should.deep.equal([ { password: 'Invalid value' } ]);
            done();
          });
    });

});


});