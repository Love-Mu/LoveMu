process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
let Message = require('../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    describe('/register', () => {
        let usr;
        beforeEach((done) => { //Before each test empty the database and reset usr
            User.remove({}, (err) => { 
                usr = {
                    email: 'test@user.com',
                    password: "TestPassPass",
                    user_name: "TestUser",
                    fname: "Test",
                    sname: "User",
                    dob: "2000-01-01 00:00:00.00Z",
                    location: "Galway",
                    image: "default.png", 
                    gender: "Rather Not Say",
                    sexuality: "Men",
                    bio: "Hello"
                }
                done();           
            });        
        });

        it('it should POST a new user with the provided details', (done) => {
            chai.request(server)
            .post('/auth/register')
            .send(usr)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successful Login!");
                res.body.should.have.property('token');
                res.body.should.have.property('id');
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
                res.body.errors.should.have.deep.members([ { email: 'Invalid value' } ]);
                User.find({}).exec((err,user) => {
                    user.should.be.empty;
                    done();
                });                
            });
        });
        it('it should not POST a bad password', (done) => {
            usr.password = "Tes";
            chai.request(server)
            .post('/auth/register')
            .send(usr)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                res.body.errors.should.have.deep.members([ { password: 'Invalid value' } ]);
                User.find({}).exec((err,user) => {
                    user.should.be.empty;
                    done();
                });    
            });
        });
        it('it should not POST an incomplete form', (done) => {
            usr.fname = "";
            usr.sname  = "";
            usr.dob = "";
            usr.location = "";
            usr.gender = "";
            usr.sexuality = "";
            chai.request(server)
            .post('/auth/register')
            .send(usr)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                res.body.errors.should.have.deep.members([ 
                    {fname: 'Invalid value'}, 
                    {sname: 'Invalid value'}, 
                    {dob: 'Invalid value'}, 
                    {location: 'Invalid value'},
                    {gender: 'Invalid value'},
                    {sexuality: 'Invalid value'},
                ]);
                User.find({}).exec((err,user) => {
                    user.should.be.empty;
                    done();
                });    
            });
        });
        it('it should not POST a used email', (done) => {
            let usr1 = new User (usr);
            let usr2 = {
                email: 'test@user.com',
                password: "TestThePass",
                user_name: "TestUser2",
                fname: "Test",
                sname: "User",
                dob: "2000-01-01 00:00:00.00Z",
                location: "Galway",
                image: "default.png",
                gender: "Rather Not Say",
                sexuality: "Men",
                bio: "Hello"
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
            let usr1 = new User (usr);
            let usr2 = {
                email: 'test2@user.com',
                password: "TestThePass",
                user_name: "TestUser",
                fname: "Test",
                sname: "User",
                dob: "2000-01-01 00:00:00.00Z",
                location: "Galway",
                image: "default.png",
                gender: "Rather Not Say",
                sexuality: "Men",
                bio: "Hello"
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
    describe('/login', () => {
        before((done) => { //Before tests empty the database then add one user
            let usr1 = new User ({
                email: "test@user.com",
                user_name: "TestUser"
            }) 
            usr1.hashPassword("TestPass").then((password) => {
                usr1.password = password;            
                User.remove({}, (err) => {
                usr1.save((err, usr1) => {
                    done();
                    });           
                }); 
            })
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
                res.body.message.should.eql("Incorrect Password");
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
                res.body.message.should.eql("Username or Email Not Associated With an Account");
                done();
            });
        });             
    });
});
