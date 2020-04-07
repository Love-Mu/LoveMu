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
    describe('/', () => {
        before((done) => { 
            done();            
        });
        it('it should');
    });
    describe('/:id', () => {
        describe('GET', () => {
            before((done) => { 
                done();            
            });
            it('it should');
        });
        describe('PUT', () => {
            before((done) => { 
                done();            
            });
            it('it should');
        });
    });
    describe('/block/:id', () => {
        before((done) => { 
            done();            
        });
        it('it should');
    });
    describe('/unblock/:id', () => {
        before((done) => { 
            done();            
        });
        it('it should');
    });
});