//Setting 6 variables: questionInndex, score, isFirstGuess, allowedMistakes, wrongAnswerList, and freeze.
let questionIndex = JSON.parse(localStorage.getItem('questionIndex')) || 0;
let score = JSON.parse(localStorage.getItem('score')) || 0;
let isFirstGuess = JSON.parse(localStorage.getItem('isFirstGuess'));
let allowedMistakes = JSON.parse(localStorage.getItem('allowedMistakes')) || 3;
let wrongAnswerList = JSON.parse(localStorage.getItem('wrongAnswerList'));
let freeze = false;

//This condition is added to aviod a bug: The player gets 3 allowedMistakes by refreshing the page when allowedMistakes = 0.
if (allowedMistakes === 3 && questionIndex - score !== 0) {
  allowedMistakes = 0;
  }

//This array has 12 objects: each object represents a question in the quiz. Each question is represented by 3 properties: question, options (an array of possible answers), and answer (the correct answer's (index + 1) of the questionList.options array). 
const questionListSource = [{
  question: 'How many moons does Saturn has?',
  options: ['20', '146', '82', '421'],
  answer: 2}, 
  {question: 'What is the name of the heighest mountain in the world?',
  options: ['Mt. Kangchenjunga', 'Mt. K2', 'Mt. Lhotse', 'Mt. Everest'],
  answer: 4},
  {question: 'What is the popular drink in the world that is not alcohol?',
  options: ['Coffee', 'Lemon juice', 'Coca Cola', 'Tea'],
  answer: 1},
  {question: 'Which animal can be seen on the Porsche logo?',
  options: ['Lion', 'Cat', 'Horse', 'Tiger'],
  answer: 3},
  {question: 'Which country invented tea?',
  options: ['Mongolia', 'Japan', 'China', 'Vietnam'],
  answer: 3},
  {question: 'Who invented scissors?',
  options: ['Jesus Christ', 'Antoni Hammelhier', 'Lenardo Mipuchi', 'Robert Hinchcliffe'],
  answer: 4},
  {question: "What is the name of the world's longest river?",
  options: ['Nile river', 'Moscow river', 'Danube river', 'Amazon river'],
  answer: 1},
  {question: "Where is the world's tallest roller coaster?",
  options: ['Spain', 'USA', 'Syria', 'Ireland'],
  answer: 2},
  {question: 'For how many nights Hanukkah celebrated?',
  options: ['Eight', 'Nine', 'Seven', 'Fourteen'],
  answer: 1},
  {question: 'How many wives did Henry VIII have?',
  options: ['Three', 'Six', 'Five', 'Four'],
  answer: 2},
  {question: 'According to Greek mythology, who was the first woman on earth?',
  options: ['Venus', 'Senn', 'Eve', 'Pandora'],
  answer: 4},
  {question: 'What is the deadliest mammal?',
  options: ['The leopard', 'The lion', 'The hippo', 'The gorilla'],
  answer: 3}];

let questionList = JSON.parse(localStorage.getItem('questionList'));

if (questionIndex === 0 && allowedMistakes === 3 && score === 0) {//Creates a random questionList, when game starts.
  localStorage.setItem('questionList', JSON.stringify(questionList = createRandomArray(questionListSource)));
}

//if (questionIndex === -1): The program is set to show the player a page that includes the message "Thank you for playing!", the player's score and a play again button.
//else (questionIndex >= 0): calls the function putQuestionAndAnswers(). as long as not all the questions in the questionList were answered correctly, the else statement will be used.
if (questionIndex === -1 || (allowedMistakes === -1)) {
//allowedMistakes === -1 condition is added to aviod a bug where the player continues playing, even though he shouldn't.
  endGame();
} else {
  putQuestionAndAnswers(questionList[questionIndex]);
}

//putQuestionAndAnswers(question) is a function that takes on parameter: question (which question object from questionList to display). This function is used for two main reasons: 1) It sets the current page, according to the current question and according to previously answered questions. 2) It removes wrong answers that were guessed before from the screen. We get to Use this function when the page is refreshed, and when we press the "Restart game" button.
function putQuestionAndAnswers(question) {

  //1) "Sets the current page, according to the current question":
  document.querySelector('.js-question').innerHTML = `${question.question}`;

  for (let index = 1; index < 5; index++) {
    document.querySelector(`.js-${index}-answer`).innerHTML = `${question.options[index-1]}`;
    if (document.querySelector(`.js-${index}-answer`).classList.contains('wrongAnswer')) {
      document.querySelector(`.js-${index}-answer`).classList.remove('wrongAnswer');
    }
  }
  
  document.querySelector('.js-result').innerHTML = '';
  document.querySelector('.js-score').innerHTML = `Your score: ${score}`;
  document.querySelector('.js-allowed-mistakes').innerHTML = `Allowed mistakes: ${allowedMistakes}`;

  //2) "Removes wrong answers that were guessed before from the screen" (if (isFirstGuess === false), if at least one wrong answer was chosen before, meaning that there is a need to show 'Your answer is incorrect.<br>Please choose the correct answer.' message, and not showing the wrong answers that were gueeses before. this is done by adding to those wrong answers the 'wrongAnswer' class):
  if (!isFirstGuess) {
    document.querySelector('.js-result').innerHTML = 'Your answer is incorrect.<br>Please choose the correct answer.';
    for (let index = 0; index < wrongAnswerList.length; index++) {
      document.querySelector(`.js-${wrongAnswerList[index]}-answer`).classList.add('wrongAnswer');
    }
  }
}

//showAnswer(question, answer) function takes two arguments: question (an object from questionList) and answer (the possible answer's (index + 1) of the questionList.options array). The function is used when we press a possible answer to the question that is asked. the function has a main if else statments:

//(main) if the correct answer was choosen: 'Your answer is correct.' appears, the questionIndex is updated (to represent then next question object in questionList) and saved in localStorage, wrongAnswerList is emptied (for the next question) and saved as well. The score increases by one point if (isFirstGuess = true), then isFirstGuess gets the value true for the next question. And then there is an inner if statement:

////if the current questionList[questionIndex] is an exsisting question object, putQuestionAndAnswers() is called with this question object.

////else: occurs when all questions were answered. In this case, the program is set to show the player a page that includes the message "Thank you for playing!", the player's score and a play again button.

//(main) else: if the incorrect answer was choosen. in this case, the message 'Your answer is incorrect.<br>Please choose the correct answer.' is shown. Then allowedMistakes -= 1 (if isFirstGuess is still = true), and if allowedMistakes -= 1 === -1, Then the game automatically ends. Otherwise, then isFirstGuess is updated to false (to not add a point to the score when the player will answer correctly). In addition, the button with the wrong answer that was presssed "deleted" (by adding a special  class called 'wrongAnswer' to this button), and then we add the chosen button to wrongAnswerList, and save it (to show only the buttons that were not chosen so far, at all case).
function showAnswer(question, answer) {

  if (answer === question.answer && !freeze) {
    freeze = true;//freeze variable is used to disable the answers buttons from being active as long as the next question is not shown (in other words, as long as putQuestionAndAnswers(questionList[questionIndex]) is not activated).
    document.querySelector('.js-result').innerHTML = 'Your answer is correct.'; 
    localStorage.setItem('questionIndex', JSON.stringify(questionIndex += 1)); 
    localStorage.setItem('wrongAnswerList', JSON.stringify(wrongAnswerList = []));
    if (isFirstGuess) {
      localStorage.setItem('score', JSON.stringify(score += 1));
      document.querySelector('.js-score').innerHTML = `Your score: ${score}`;
    }
    localStorage.setItem('isFirstGuess', JSON.stringify(isFirstGuess = true));
    if (questionIndex < questionList.length) {
      setTimeout(() => { putQuestionAndAnswers(questionList[questionIndex]);
      freeze = false; }, 2000);
    } else { localStorage.setItem('questionIndex', JSON.stringify(questionIndex = -1));
              setTimeout(() => { endGame(); }, 2000);
  }
      
    } else if (!freeze) {
    document.querySelector('.js-result').innerHTML = 'Your answer is incorrect.<br>Please choose the correct answer.';
    if (isFirstGuess) {
      localStorage.setItem('allowedMistakes', JSON.stringify(allowedMistakes -= 1));
      if (allowedMistakes >= 0) {
        document.querySelector('.js-allowed-mistakes').innerHTML = `Allowed mistakes: ${allowedMistakes}`;
      }
      if (allowedMistakes === -1) {
        freeze = true;
        setTimeout(() => { endGame();
       }, 2000);
      }
    }
    localStorage.setItem('isFirstGuess', JSON.stringify(isFirstGuess = false));
    document.querySelector(`.js-${answer}-answer`).classList.add('wrongAnswer');
    wrongAnswerList.push(answer);
    localStorage.setItem('wrongAnswerList', JSON.stringify(wrongAnswerList));
  } 
}

//endGame function shows the player a page that includes the message "Thank you for playing!", the player's score and a play again button.
function endGame() {
  localStorage.setItem('questionIndex', JSON.stringify(questionIndex = -1));
  document.body.innerHTML =`<p class="end-of-the-game">Thank you for playing!</p>
    <p class="end-of-the-game">You scored: ${score} points.</p>
    <p><button><a href="quiz.html" class="play-again-button" onclick ="
    localStorage.setItem('questionIndex', JSON.stringify(questionIndex = 0));
    localStorage.setItem('score', JSON.stringify(score = 0));
    localStorage.setItem('isFirstGuess', JSON.stringify(isFirstGuess = true));
    localStorage.setItem('allowedMistakes', JSON.stringify(allowedMistakes = 3));
    localStorage.setItem('wrongAnswerList', JSON.stringify(wrongAnswerList = []));
    ">Play again</a>
    </button></p>`;
}

//createRandomArray creates a random array from an existing array.
function createRandomArray(array) {
  let arrayCopy = array.slice();
  let randomArray = [];

  while (arrayCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length) ;
    randomArray.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
    }

  return randomArray;

}
