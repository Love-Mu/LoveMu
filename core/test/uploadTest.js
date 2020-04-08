process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');
let Message = require('../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const fs = require('fs-extra');

chai.use(chaiHttp);

describe('Upload', () => {
    describe('/upload', () => {
        beforeEach((done) => { //clear the test temp uploads folder
            if( fs.existsSync('./public/temp/testCookie') ) {
                fs.readdirSync('./public/temp/testCookie').forEach(function(file,index){
                    var nextPath = './public/temp/testCookie' + "/" + file;
                    fs.unlinkSync(nextPath);
                });
                fs.rmdirSync('./public/temp/testCookie');    
            }
            done();
        });
        it('it should upload a file, and store it in the file system', (done) => {
            chai.request(server)
            .post('/upload/upload')
            .set('Cookie', 'fileCookie=testCookie')
            .attach('file', fs.readFileSync('./test/testImage.jpg'),'testImage.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('filename');
                res.body.should.have.property('cookie');
                res.body.cookie.should.eql("testCookie");
                fs.pathExists("./public/temp/testCookie/"+res.body.filename, (err, exists) =>{
                    exists.should.be.true;
                    done();
                })                
            });
        });
        it('it should not upload a file that is not an image', (done) => {
            chai.request(server)
            .post('/upload/upload')
            .set('Cookie', 'fileCookie=testCookie')
            .attach('file', fs.readFileSync('./test/testText.txt'), 'testText.txt')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('File is not an image');
                fs.pathExists("./public/temp/testCookie/", (err, exists) =>{
                    exists.should.be.false;
                    done();
                })
            });
        });
    });
    describe('/save', () => {
        let filename;
        before((done) => { //delete any existing test files, upload new file and store name
            if( fs.existsSync('./public/temp/testCookie') ) {
                fs.readdirSync('./public/temp/testCookie').forEach(function(file,index){
                    var nextPath = './public/temp/testCookie' + "/" + file;
                    fs.unlinkSync(nextPath);
                });
                fs.rmdirSync('./public/temp/testCookie');    
            }
            chai.request(server)
            .post('/upload/upload')
            .set('Cookie', 'fileCookie=testCookie')
            .attach('file', fs.readFileSync('./test/testImage.jpg'),'testImage.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('filename');
                res.body.should.have.property('cookie');
                res.body.cookie.should.eql("testCookie");
                fs.pathExists("./public/temp/testCookie/"+res.body.filename, (err, exists) =>{
                    exists.should.be.true;
                    filename = res.body.filename;
                    done();
                })    
            });            
        });

        it('it should save a file to the specified places and remove old files', (done) => {
            let req = {filename:filename, cookie:"testCookie"};
            chai.request(server)
            .post('/upload/save')
            .send(req)
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('done');
                fs.existsSync("./public/temp/testCookie/"+filename).should.be.false;
                fs.existsSync("./public/"+filename).should.be.true;
                fs.existsSync("./uploads/"+filename).should.be.true;
                done(); 
            });
        });

        after((done) => { //delete any existing test files
            if( fs.existsSync('./public/'+filename) ) {
                fs.unlinkSync('./public/'+filename);  
            }
            if( fs.existsSync('./uploads/'+filename) ) {
                fs.unlinkSync('./uploads/'+filename);  
            }           
            done();
        });
    });
    describe('/reupload', () => {
        let authorisedUser = chai.request.agent(server);
        let filename;
        let token;
        let userID;
        beforeEach((done) => { //create and login user
            if( fs.existsSync('./public/temp/testCookie') ) {
                fs.readdirSync('./public/temp/testCookie').forEach(function(file,index){
                    var nextPath = './public/temp/testCookie' + "/" + file;
                    fs.unlinkSync(nextPath);
                });
                fs.rmdirSync('./public/temp/testCookie');    
            }
            let usr = new User ({
                email: "test@user.com",
                user_name: "TestUser",
                image: filename
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
                        });
                    });           
                });  
            });            
        });
        it('it should upload the new file', (done) => {
            authorisedUser
            .post('/upload/reupload')
            .set("Authorization", "Bearer " + token)
            .attach('file', fs.readFileSync('./test/testImage.jpg'),'testImage.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('newFile');
                fs.pathExists("./public/temp/"+userID+'/'+res.body.newFile, (err, exists) =>{
                    exists.should.be.true;
                    done();
                })                
            });
        });
        it('it should not upload a file that is not an image', (done) => {
            authorisedUser
            .post('/upload/reupload')
            .set("Authorization", "Bearer " + token)
            .attach('file', fs.readFileSync('./test/testText.txt'), 'testText.txt')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('File is not an image');
                fs.pathExists("./public/temp/testCookie/", (err, exists) =>{
                    exists.should.be.false;
                    done();
                })
            });
        });
        afterEach((done) => {
            if( fs.existsSync('./public/temp/'+userID) ) {
                fs.readdirSync('./public/temp/'+userID).forEach(function(file,index){
                    var nextPath = './public/temp/'+userID + "/" + file;
                    fs.unlinkSync(nextPath);
                });
                fs.rmdirSync('./public/temp/'+userID);    
            }
            done();
        })
    });
    describe('/update', () => {
        let authorisedUser = chai.request.agent(server);
        let oldFile, newFile;
        let token;
        let userID;
        before((done) => { //upload & save file to use as user pic, then create and login user, then reupload
            //clear tempFolder
            if( fs.existsSync('./public/temp/testCookie') ) {
                fs.readdirSync('./public/temp/testCookie').forEach(function(file,index){
                    var nextPath = './public/temp/testCookie' + "/" + file;
                    fs.unlinkSync(nextPath);
                });
                fs.rmdirSync('./public/temp/testCookie');    
            }
            //upload image
            chai.request(server)
            .post('/upload/upload')
            .set('Cookie', 'fileCookie=testCookie')
            .attach('file', fs.readFileSync('./test/testImage.jpg'),'testImage.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('filename');
                res.body.should.have.property('cookie');
                res.body.cookie.should.eql("testCookie");
                fs.pathExists("./public/temp/testCookie/"+res.body.filename, (err, exists) =>{
                    exists.should.be.true;
                    oldFile = res.body.filename;
                    //save image
                    chai.request(server)
                    .post('/upload/save')
                    .send({filename:oldFile, cookie:"testCookie"})
                    .end((err,res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.message.should.eql('done');
                        fs.existsSync("./public/temp/testCookie/"+oldFile).should.be.false;
                        fs.existsSync("./public/"+oldFile).should.be.true;
                        fs.existsSync("./uploads/"+oldFile).should.be.true;
                        //create new user
                        let usr = new User ({
                            email: "test@user.com",
                            user_name: "TestUser",
                            image: oldFile
                        }) 
                        usr.hashPassword("TestPass").then((password) => {
                            usr.password = password;            
                            User.remove({}, (err) => {
                                usr.save((err, usr) => {
                                    if(err) console.log(err);
                                    userID = usr.id;
                                    console.log(usr.id);
                                    //login
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
                                        //reupload
                                        authorisedUser
                                        .post('/upload/reupload')
                                        .set("Authorization", "Bearer " + token)
                                        .attach('file', fs.readFileSync('./test/testImage.jpg'),'testImage.jpg')
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            res.body.should.have.property('newFile');
                                            fs.pathExists("./public/temp/"+userID+'/'+res.body.newFile, (err, exists) =>{
                                                exists.should.be.true;
                                                newFile = res.body.newFile;
                                                done();
                                            })                
                                        });
                                    });
                                });           
                            }); 
                        })
                    });
                })    
            });            
        });

        it('it should replace user\'s current image with the new one', (done) => {
            authorisedUser
            .post('/upload/update')
            .set("Authorization", "Bearer " + token)
            .send({oldFile:oldFile, newFile:newFile})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('done');
                //old file should be gone
                fs.existsSync("./public/"+oldFile).should.be.false;
                fs.existsSync("./uploads/"+oldFile).should.be.false;
                //new file should be moved from temp into public/uploads 
                fs.existsSync("./public/temp/"+userID+"/"+newFile).should.be.false;
                fs.existsSync("./public/"+newFile).should.be.true;
                fs.existsSync("./uploads/"+newFile).should.be.true;    
                done();                          
            });
        });

        after((done) => { //delete any existing test files
            if( fs.existsSync('./public/'+newFile) ) {
                fs.unlinkSync('./public/'+newFile);  
            }
            if( fs.existsSync('./uploads/'+newFile) ) {
                fs.unlinkSync('./uploads/'+newFile);  
            }           
            done();
        });
    });
});