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

describe('Authentication', () => {
    describe('Registration', () => {
        beforeEach((done) => { //Before each test empty the database`
            User.remove({}, (err) => {
                done();           
            });        
        });

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
                res.body.message.should.eql("Successful Login!");
                User.findOne({email:'test@user.com'}).exec((err,user) => {
                    user.user_name.should.not.be.empty;
                    done();
                });
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
                User.find({}).exec((err,user) => {
                    user.should.be.empty;
                    done();
                });                
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
                User.find({}).exec((err,user) => {
                    user.should.be.empty;
                    done();
                });    
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
                    User.find({}).exec((err,user) => {
                        user.should.be.a('array');
                        user.length.should.eql(1);
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
        
        it('it should login an existing user', (done) => {
            let usr = {
                email:"test@user.com",
                password:"TestPass"  
            }
            chai.request(server)
            .post('/auth/login')
            .send(usr)
            .end((err, res) => {
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
    var authorisedUser = chai.request.agent(server);
    let token;
    describe('/retrieve/:id', () => {
        before((done) => { //Before tests empty the database then add two users and two messages, then log in one user
            let usr1 = new User ({
                email: "test1@user.com",
                user_name: "User1"
            }) 
            let usr2 = new User ({
                email: "test2@user.com",
                user_name: "User2"
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
                authorisedUser
                .post('/auth/login')
                .send(usr)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("Successful Login!");
                    res.body.token.should.not.be.empty;
                    token = res.body.token;
                    done();
                }); 
            }); 
        });
        it('it should return all the messages between two users', (done) => {
            User.findOne({email:"test2@user.com"}).exec((err, rec) => {
                authorisedUser
                .get('/messages/retrieve/'+rec._id)
                .set("Authorization",
                    "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
            });
        });
    });
    describe('/send', () => {
        before((done) => { //Before tests empty the database then add two users and two messages, then log in one user
            let usr1 = new User ({
                email: "test1@user.com",
                user_name: "User1"
            }) 
            let usr2 = new User ({
                email: "test2@user.com",
                user_name: "User2"
            }) 
            usr1.password = usr1.hashPassword("TestPass1");
            usr2.password = usr2.hashPassword("TestPass2");
            User.remove({}, (err) => {
                Message.remove();
                usr1.save();
                usr2.save();  
                usr = {
                    email: "test1@user.com", 
                    password: "TestPass1"
                }
                authorisedUser
                .post('/auth/login')
                .send(usr)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("Successful Login!");
                    res.body.token.should.not.be.empty;
                    token = res.body.token;
                    done();
                }); 
            }); 
        });
        it('it should send a message to the database', (done) => {
            User.findOne({email:"test2@user.com"}).exec((err, rec) => {
                console.log(rec._id);
                User.findOne({email:"test1@user.com"}).exec((err, usr) => {
                    let message = {body:'This is a message', recipient:rec._id};
                    authorisedUser
                    .post('/messages/send')
                    .set("Authorization",
                            "Bearer " + token)
                    .send(message)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql("Message Successfully Saved to DB");
                        res.body.should.have.property('sender');
                        res.body.sender.should.deep.eql(usr.id);
                        res.body.should.have.property('recipient');
                        res.body.recipient.should.eql(rec.id);
                        done();
                    });
                });
            });            
        });
        it('it should not send a blank message', (done) => {
            User.findOne({email:"test2@user.com"}).exec((err, rec) => {
                console.log(rec._id);
                User.findOne({email:"test1@user.com"}).exec((err, usr) => {
                    let message = {body:'', recipient:rec._id};
                    authorisedUser
                    .post('/messages/send')
                    .set("Authorization",
                            "Bearer " + token)
                    .send(message)
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql('Blank message');
                        res.body.should.have.property('sender');
                        res.body.sender.should.deep.eql(usr.id);
                        res.body.should.have.property('recipient');
                        res.body.recipient.should.eql(rec.id);
                        done();
                    });
                });
            });            
        });
    });
});