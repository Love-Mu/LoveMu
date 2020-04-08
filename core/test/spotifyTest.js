process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
let Message = require('../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe.only('Spotify', () => {
    let authorisedUser = chai.request.agent(server);
    let token;
    let userID;
    beforeEach((done) => { //login
        let usr = new User ({
            email: "test@user.com",
            user_name: "TestUser"
        }) 
        usr.hashPassword("TestPass").then((password) => {
            usr.password = password;            
            User.remove({}, (err) => {
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
            })
        });

    })
    describe('/storeToken', () => { 
        before((done) => { 
            done();            
        });
        it('it should store a token for the user', (done) =>{
            authorisedUser
            .post('/spotify/storeToken')
            .set("Authorization", "Bearer " + token)
            .send({refresh_token:`${process.env.refToken}`})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Successfully Updated Tokens');
                User.findOne({_id:userID}).exec((err,user) => {
                    user.refresh_token.should.not.be.empty;
                    user.refresh_token.should.eql(`${process.env.refToken}`);
                    done();
                });
            })
        });
        it('it should return an error if no token found', (done) =>{
            authorisedUser
            .post('/spotify/storeToken')
            .set("Authorization", "Bearer " + token)
            .send()
            .end((err,res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.eql('access_token or refresh_token not provided');
                User.findOne({_id:userID}).exec((err,user) => {
                    user.refresh_token.should.be.empty;
                    done();
                });
            })
        });
    });
    describe('/refreshAccess', () => {
        beforeEach((done) => { //make sure user has refresh token
            authorisedUser
            .post('/spotify/storeToken')
            .set("Authorization", "Bearer " + token)
            .send({refresh_token:`${process.env.refToken}`})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Successfully Updated Tokens');
                User.findOne({_id:userID}).exec((err,user) => {
                    user.refresh_token.should.not.be.empty;
                    user.refresh_token.should.eql(`${process.env.refToken}`);
                    done();
                });
            })           
        });
        it('it should give the user an access token',(done) =>{
            authorisedUser
            .post('/spotify/refreshAccess')
            .set("Authorization", "Bearer " + token)
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql("Successful Refresh!");
                User.findOne({_id:userID}).exec((err,user) => {
                    user.access_token.should.not.be.empty;
                    done();
                });
            })
        });
    });
    describe('/retrieveDetails', () => {
        beforeEach((done) => { //make sure user has refresh token
            authorisedUser
            .post('/spotify/storeToken')
            .set("Authorization", "Bearer " + token)
            .send({refresh_token:`${process.env.refToken}`})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Successfully Updated Tokens');
                User.findOne({_id:userID}).exec((err,user) => {
                    user.refresh_token.should.not.be.empty;
                    user.refresh_token.should.eql(`${process.env.refToken}`);
                    authorisedUser
                    .post('/spotify/refreshAccess')
                    .set("Authorization", "Bearer " + token)
                    .end((err,res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql("Successful Refresh!");
                        User.findOne({_id:userID}).exec((err,user) => {
                            user.access_token.should.not.be.empty;
                            done();
                        });
                    })
                });
            })           
        });           
        it('it should populate the db with spotify info', (done) =>{
            authorisedUser
            .post('/spotify/retrieveDetails')
            .set("Authorization", "Bearer " + token)
            .end((err,res) => {
                res.should.have.status(200);
                User.findOne({_id:userID}).exec((err,user) => {
                    user.artists.should.not.be.empty;
                    user.artists.should.be.a('Map');
                    user.playlists.should.not.be.empty;
                    user.playlists.should.be.a('array');
                    user.genres.should.not.be.empty;
                    user.genres.should.be.a('Map');
                    done();
                });
            })
        });
    });
    describe('/search', () => {
        beforeEach((done) => { 
            authorisedUser
            .post('/spotify/storeToken')
            .set("Authorization", "Bearer " + token)
            .send({refresh_token:`${process.env.refToken}`})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('Successfully Updated Tokens');
                User.findOne({_id:userID}).exec((err,user) => {
                    user.refresh_token.should.not.be.empty;
                    user.refresh_token.should.eql(`${process.env.refToken}`);
                    authorisedUser
                    .post('/spotify/refreshAccess')
                    .set("Authorization", "Bearer " + token)
                    .end((err,res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql("Successful Refresh!");
                        User.findOne({_id:userID}).exec((err,user) => {
                            user.access_token.should.not.be.empty;
                            done();
                        });
                    })
                });
            })           
        }); 
        it('it should return results for searching for a track', (done) => {
            authorisedUser
            .post('/spotify/search')
            .set("Authorization", "Bearer " + token)
            .send({query:'bohemian rhapsody',type:'track'})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('items');
                res.body.items.should.be.a('array');
                res.body.items.should.have.length.below(21);
                res.body.should.have.property('href');
                res.body.href.should.eql("https://api.spotify.com/v1/search?query=bohemian+rhapsody&type=track&offset=0&limit=20");
                res.body.items[0].name.should.have.string("Bohemian Rhapsody");
                done();
            })
        });
        it('it should return results for searching for an artist', (done) => {
            authorisedUser
            .post('/spotify/search')
            .set("Authorization", "Bearer " + token)
            .send({query:'queen',type:'artist'})
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('items');
                res.body.items.should.be.a('array');
                res.body.items.should.have.length.below(21);
                res.body.should.have.property('href');
                res.body.href.should.eql("https://api.spotify.com/v1/search?query=queen&type=artist&offset=0&limit=20");
                res.body.items[0].name.should.have.string("Queen");
                done();
            })
        });
    });
});