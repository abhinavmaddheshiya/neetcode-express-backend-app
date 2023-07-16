const express = require('express')
const crypto = require('crypto');

const app = express()
const port = 3000

const USERS = [];
const QUESTIONS = [{
  title: "Max Sum",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];
const SUBMISSION = [
  // {
  //   userId: "1",
  //   questionId: "1",
  //   code: "function max(arr) {return Math.max(...arr) }",
  //   status: "accepted"
  // },
  // {
  //   userId: "1",
  //   questionId: "1",
  //   code: "function max(arr) {return Math.min(...arr) }",
  //   status: "rejected"
  // }
];

function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

app.post('/signup', function(req, res) {
  //add logic to decode body
  const { email, password } = req.body;

  //body should have email and password
  if(!email || !password){
    return res.status(400).send("User and password is Required.");
  }

  //store email and password (as is for now) in the USERS array above (only with the user with the given email doesnt exists)
  const userExists = USERS.find(user => user.email ===email);
  if(userExists){
    return res.status(409).send('User already exits.');
  }
  USERS.push({ email, password });
  //return back 200 status code to the client
  res.sendStatus(200);
})

app.post('/login', function(req, res) {
  //add logic to decode body
  const { email, password } = req.body;

  //body should have email and password
  if(!email || !password){
    return res.status(400).send("Email and password is Required.");
  }

  //Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  
  //Also ensure that the password is the same
  if(user && user.password === password){
    //Also send back a token (any random string will do for now)
    const token = generateToken();

    //If the password is the same, return back 200 status code to the client
    return res.status(200).json({ token });
  }else{
    //If password is not the same, return back 401 status code to the client
    return res.status(401).send("Invalid email or password.");
  }
})

app.get('/questions', function(req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
})

app.get('/submissions', function(req, res) {
  //return the users submissions for this problem
  const questionId = req.query.questionId;
  const userSubmissions = SUBMISSION.filter(submission => submission.questionId === questionId);
  res.json(userSubmissions);
})

app.post('/submissions', function(req, res) {
  //let the user submit a problem, randomly accept or reject the solution
  const { userId, questionId, code } = req.body;
  const isAccepted = Math.random() < 0.5;
  //store the submission in the SUBMISSION array
  const submission = {
    userId,
    questionId,
    code,
    isAccepted
  };
  SUBMISSION.push(submission);
  res.status(200).json({ isAccepted });
})
app.listen(port, function() {
  console.log(`App listening on port ${port}`)
})