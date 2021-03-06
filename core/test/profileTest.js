process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
let Message = require('../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Profile', () => {
    let authorisedUser = chai.request.agent(server);
    let userID;
    let token;
    let u1 = new User ({email:"male@male.com",user_name: "MaleMale",fname: "Male",sname: "Male",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Male",sexuality: "Male",bio: "Hello"});
    let u2 = new User ({email:"male@female.com",user_name: "MaleFem",fname: "Male",sname: "Fem",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Male",sexuality: "Female",bio: "Hello"});
    let u3 = new User ({email:"male@both.com",user_name: "MaleBoth",fname: "Male",sname: "Both",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Male",sexuality: ["Male","Female","Rather Not Say", "Other"],bio: "Hello"});
    let u4 = new User ({email:"female@male.com",user_name: "FemMale",fname: "Fem",sname: "Male",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Female",sexuality: "Male",bio: "Hello"});
    let u5 = new User ({email:"female@female.com",user_name: "FemFem",fname: "Fem",sname: "Fem",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Female",sexuality: "Female",bio: "Hello"});
    let u6 = new User ({email:"female@both.com",user_name: "FemBoth",fname: "Fem",sname: "Both",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Female",sexuality: ["Male","Female","Rather Not Say", "Other"],bio: "Hello"});
    let u7 = new User ({email:"blocked@user.com",user_name: "BlockedUser",fname: "Blocked",sname: "User",dob: "2000-01-01 00:00:00.00Z",location: "Galway",image: "default.png",gender: "Rather Not Say",sexuality: ["Male","Female","Rather Not Say", "Other"],bio: "Hello"});
    before((done) =>{
        let promises = [u1.save(), u2.save(), u3.save(), u4.save(), u5.save(), u6.save(), u7.save()];
        User.remove({}, (err) => {
            Promise.all(promises).then((users) => {
                let usr = new User ({
                    email: "test@user.com",
                    user_name: "TestUser",
                    fname: "Test",
                    sname: "User",
                    dob: "2000-01-01 00:00:00.00Z",
                    location: "Galway",
                    image: "default.png",
                    gender: "Male",
                    sexuality: "Male",
                    bio: "Hello"
                }) 
                usr.hashPassword("TestPass").then((password) => {
                    usr.password = password;            
                    usr.save((err, usr) => {
                        if(err) console.log(err);
                        userID = usr.id;
                        authorisedUser
                        .post('/auth/login')
                        .send({email:'test@user.com',password:'TestPass'})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message');
                            res.body.message.should.eql("Successful Login!");
                            res.body.token.should.not.be.empty;
                            token = res.body.token;
                            done();
                        })
                    })
                });
            })
        });     
    })              
    describe('/', () => {      
        it('it should return all profiles matching preferences',(done) => { 
            authorisedUser
            .get('/profiles/')
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(2);
                res.body[0].should.have.property('fname').that.eqls("Male");
                res.body[1].should.have.property('fname').that.eqls("Male");
                res.body[0].should.have.property('sname').that.eqls("Both");
                res.body[1].should.have.property('sname').that.eqls("Male");
                done();
            });
        });
        it('it should not return users blocked by curruser',(done) => {
            let blockedID;
            User.findOne({user_name: 'BlockedUser'}).exec((err,user) =>{
                blockedID = user._id;
                User.update({_id:userID},{sexuality:["Male","Female","Rather Not Say", "Other"],blocked:blockedID}).exec((err,user) =>{
                    authorisedUser
                    .get('/profiles/')
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.length(4);
                        res.body[0].should.have.property('fname').that.does.not.eql("Blocked");
                        res.body[1].should.have.property('fname').that.does.not.eql("Blocked");
                        res.body[2].should.have.property('fname').that.does.not.eql("Blocked");
                        res.body[3].should.have.property('fname').that.does.not.eql("Blocked");
                        done();
                    });
                });
            });            
        });
        it('it should not return users that have blocked currUser', (done) => {
            User.update({user_name:"MaleMale"},{blocked: [userID]}).exec((err,user) =>{
                User.update({_id:userID},{sexuality:"Male"}).exec((err,user1) =>{
                    authorisedUser
                    .get('/profiles/')
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.length(1);
                        res.body[0].should.have.property('sname').that.does.not.eql("Male");
                        done();
                    });
                });
            });
        });
        it('it should return a message if no users match',(done) => {
            User.update({_id:userID},{sexuality:"Other"}).exec((err,user) =>{
                authorisedUser
                .get('/profiles/')
                .set("Authorization", "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("No Users Found");
                    done();
                });
            });
        });
    });
    describe('/:id', () => {
        describe('GET', () => {
            it('it should get current users profile info when req userID', (done) => {
                User.update({_id:userID},{sexuality:"Male"}).exec((err,user) =>{
                    authorisedUser
                    .get('/profiles/'+userID)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('email').that.eqls("test@user.com");
                        res.body.should.have.property('user_name').that.eqls("TestUser");
                        res.body.should.have.property('fname').that.eqls("Test");
                        res.body.should.have.property('sname').that.eqls("User");
                        res.body.should.have.property('location').that.eqls("Galway");
                        res.body.should.have.property('image').that.eqls("default.png");
                        res.body.should.have.property('gender').that.eqls("Male");
                        res.body.should.have.property('sexuality').that.eqls("Men");
                        res.body.should.have.property('bio').that.eqls("Hello");
                        done();
                    });
                });
            });
            it('it should get other users profile info when req otherUserID', (done) => {
                User.findOne({user_name: 'MaleMale'}).exec((err,user) =>{
                    otherID = user._id;
                    authorisedUser
                    .get('/profiles/'+otherID)
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('email').that.eqls("male@male.com");
                        res.body.should.have.property('user_name').that.eqls("MaleMale");
                        res.body.should.have.property('fname').that.eqls("Male");
                        res.body.should.have.property('sname').that.eqls("Male");
                        res.body.should.have.property('location').that.eqls("Galway");
                        res.body.should.have.property('image').that.eqls("default.png");
                        res.body.should.have.property('gender').that.eqls("Male");
                        res.body.should.have.property('sexuality').that.eqls("Men");
                        res.body.should.have.property('bio').that.eqls("Hello");
                        done();
                    });
                }); 
            });
        });
        describe('PUT', () => {
            it('it should update the current users profile with new info', (done) =>{
                authorisedUser
                .put('/profiles/'+userID)
                .set("Authorization", "Bearer " + token)
                .send({
                    user_name: "TestUser",
                    fname: "Testing",
                    sname: "User",
                    dob: "2000-01-01 00:00:00.00Z",
                    location: "Ireland",
                    image: "default.png",
                    gender: "Male",
                    sexuality: "Everyone",
                    bio: "Hello there",
                    blocked: [],
                    playlist: "",
                    favouriteSong: ""
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').that.eqls("Successful Update!");
                    User.findOne({_id:userID}).exec((err,user) => {
                        user.should.have.property('email').that.eqls("test@user.com");
                        user.should.have.property('user_name').that.eqls("TestUser");
                        user.should.have.property('fname').that.eqls("Testing");
                        user.should.have.property('sname').that.eqls("User");
                        user.should.have.property('location').that.eqls("Ireland");
                        user.should.have.property('image').that.eqls("default.png");
                        user.should.have.property('gender').that.eqls("Male");
                        user.should.have.property('sexuality').that.is.a('array').that.has.members(["Male","Female","Rather Not Say", "Other"]);
                        user.should.have.property('bio').that.eqls("Hello there");
                        done();
                    });
                });
            });
        });
    });
    describe('/:id/block', () => {
        it('it should add user to blocked list',(done)=>{
            User.findOne({user_name: 'MaleMale'}).exec((err,user) =>{
                otherID = user._id;
                authorisedUser
                .post('/profiles/'+otherID+'/block')
                .set("Authorization", "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.eql("Successfully Blocked User")
                    User.findOne({_id:userID}).exec((err,user) => {
                        user.should.have.property('blocked');
                        user.blocked.should.contain(otherID);
                        done();
                    });
                });
            }); 
        });
    });
    describe('/:id/unblock', () => {
        it('it should remove blocked user from the array', (done)=>{
            User.findOne({user_name: 'MaleMale'}).exec((err,user) =>{
                otherID = user._id;
                User.findOne({_id:userID}).exec((err,user) => { //ensure user blocked before unblocking
                    user.should.have.property('blocked');
                    user.blocked.should.contain(otherID);
                    authorisedUser
                    .post('/profiles/'+otherID+'/unblock')
                    .set("Authorization", "Bearer " + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql("Successfully Unblocked User")
                        User.findOne({_id:userID}).exec((err,user) => {
                            user.should.have.property('blocked');
                            user.blocked.should.not.contain(otherID);
                            done();
                        });
                    });
                });    
            });
        });
    });
    after((done) =>{
        User.remove({}, (err) =>{
            done();
        })
    })
});