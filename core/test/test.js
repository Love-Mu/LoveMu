//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
const Message = require('../models/Message');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Registration', () => {
    beforeEach((done) => { //Before each test empty the database`
        User.remove({}, (err) => {
            done();           
        });        
    });

    /*
    * Test the Registration
    */
    describe('5 Tests', () => {
        let usr = {
            email: 'test@user.com',
            password: "TestPassPass",
            user_name: "TestUser",
        }
        it('it should POST a new user with the provided details', (done) => {
            
            chai.request(server)
            .post('/auth/register')
            .send(usr)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successfully Registered!");
                done();
            });
        });
        it('it should not POST a bad email', (done) => {
            usr.email = "testuser.com";
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
        it('it should not POST a bad password', (done) => {
            usr.email = "test@user.com";
            usr.password = "Tes";
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
        it('it should not POST a used email', (done) => {
            let usr1 = new User ({
                email: 'test@user.com',
                password: "TestPass",
                user_name: "TestUser",
            })
            let usr2 = {
                email: 'test@user.com',
                password: "TestThePass",
                user_name: "TestUser",
            }
            usr1.save((err, usr1) => {
                chai.request(server)
                .post('/auth/register')
                .send(usr2)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("Email already part of account");
                    done();
                });
            });
        });
        it('it should not POST a used username', (done) => {
            let usr1 = new User ({
                email: 'test@user.com',
                password: "TestPass",
                user_name: "TestUser",
            })
            let usr2 = {
                email: 'test2@user.com',
                password: "TestThePass",
                user_name: "TestUser",
            }
            usr1.save((err, usr1) => {
                chai.request(server)
                .post('/auth/register')
                .send(usr2)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("Username already part of account");
                    done();
                });
            });
        });
    });
});

describe('Login', () => {
    before((done) => { //Before tests empty the database then add one user
        let usr1 = new User ({
            email: "test@user.com",
            user_name: "TestUser"
        }) 
        usr1.password = usr1.hashPassword("TestPass");
        User.remove({}, (err) => {
            usr1.save((err, usr1) => {
                done();
            });           
        }); 
    });

    /*
    * Test the Login
    */
    describe('3 Tests', () => {
        it('it should login an existing user', (done) => {
            let usr = {
                email:"test@user.com",
                password:"TestPass"  
            }
            chai.request(server)
            .post('/auth/login')
            .send(usr)
            .end((err, res) => {
                console.log(usr);
                res.should.redirect;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successful Login!");
                done();
            });
        });  
        it('it should not login an existing user with a bad password', (done) => {
            let usr = {
                email:"test@user.com",
                password:"WrongPass"
            }
            chai.request(server)
            .post('/auth/login')
            .send(usr)
            .end((err, res) => {
                res.should.redirect;
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Unsuccessful Login!");
                done();
            });
        }); 
        it('it should not login when the email is not recognised', (done) => {
            let usr = {
                email:"wrong@user.com",
                password:"TestPass"
            }
            chai.request(server)
            .post('/auth/login')
            .send(usr)
            .end((err, res) => {
                res.should.redirect;
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Unsuccessful Login!");
                done();
            });
        });             
    });
});

describe('Messaging', () => {
    before((done) => { //Before tests empty the database then add two users and two messages, then log in one user
        let usr1 = new User ({
            email: "test1@user.com",
        }) 
        let usr2 = new User ({
            email: "test2@user.com",
        }) 
        let msg1 = new Message ({
            sender: usr1._id,
            recipient: usr2._id,
            body: "How are you?"
        })
        let msg2 = new Message ({
            sender: usr2._id,
            recipient: usr1._id,
            body: "Good and yourself?"
        })
        usr1.password = usr1.hashPassword("TestPass1");
        usr2.password = usr2.hashPassword("TestPass2");
        User.remove({}, (err) => {
            usr1.save();
            usr2.save();  
        });
        Message.remove({}, (err) =>{
            msg1.save();
            msg2.save();
            usr = {
                email: "test1@user.com", 
                password: "TestPass1"
            }
            chai.request(server)
            .post('/auth/login')
            .send(usr)
            .end((err, res) => {
                res.should.redirect;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successful Login!");
                done();
            }); 
        }); 
    });
    /*
    * Test the Messages
    */
    describe('/retrieve', () => {
         it('it should return all the messages between two users', (done) => {
            chai.request(server)
            .get('/messages/retrieve')
            .send(usr2)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
         });
    });
});