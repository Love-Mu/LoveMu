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
        it('it should POST a new user with the provided details', (done) => {
            let usr = {
                email: 'test@user.com',
                password: "TestPassPass",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"),
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
            }
            chai.request(server)
            .post('/auth/register')
            .send(usr)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successful Register!");
                done();
            });
        });
        it('it should not POST a bad email', (done) => {
            let usr = {
                email: 'testuser.com',
                password: "TestPassPass",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
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
        it('it should not POST a bad password', (done) => {
            let usr = {
                email: 'test@user.com',
                password: "Tes",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
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
        it('it should not POST a used email', (done) => {
            let usr1 = new User ({
                email: 'test@user.com',
                password: "TestPass",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
            })
            let usr2 = {
                email: 'test@user.com',
                password: "TestThePass",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
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
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
            })
            let usr2 = {
                email: 'test2@user.com',
                password: "TestThePass",
                user_name: "TestUser",
                fname: "Conor",
                sname: "Smith",
                dob: new Date("1999-11-12"), 
                location: "Spain",
                image: "picture.jpg",
                gender: "Test",
                sexuality: "Robot",
                bio: "I am a test"
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
            email: 'test@user.com',
            password: usr.hashPassword("TestPass"),
            user_name: "TestUser",
            fname: "Conor",
            sname: "Smith",
            dob: new Date("1999-11-12"), 
            location: "Spain",
            image: "picture.jpg",
            gender: "Test",
            sexuality: "Robot",
            bio: "I am a test"
        }) 
        User.remove({}, (err) => {
            usr1.save((err, usr1) => {
                done();
            });           
        }); 
    });

    /*
    * Test the Login
    */
    describe('Tests', () => {
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
            done();
        }); 
        it('it should not login when the email is not recognised', (done) => {
            done();
        });             
    });
});