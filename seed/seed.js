const mongoose = require('mongoose');
const {Article, Comment, Topic, User} = require('../models');

const dataSet = process.env.NODE_ENV === 'test' ? 'testData' : 'devData';

const articleData = require(`./${dataSet}/articles.json`);
const commentData = require(`./${dataSet}/comments.json`);
const topicData = require(`./${dataSet}/topics.json`);
const userData = require(`./${dataSet}/users.json`);

function seedDB () {

}

module.exports = seedDB