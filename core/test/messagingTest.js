process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
let Message = require('../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

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
            usr1.hashPassword("TestPass").then((password) => {
                usr1.password = password;            
                usr2.hashPassword("TestPass").then((password) => {
                    usr2.password = password;            
                    User.remove({}, (err) => {
                        usr1.save((err, usr1) => {
                            console.log("User1 saved");
                        });  
                        usr2.save((err, usr2) => {
                            console.log("User2 saved");
                        });           
                    }); 
                })
            })
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