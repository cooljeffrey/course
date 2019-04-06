var generateRandomNumbers = function(min, max, total) {
  var nums = [];
  while (nums.length < total) {
    var ran = Math.floor(Math.random() * max) + min;
    if (nums.indexOf(ran) === -1) nums.push(ran);
  }
  return nums;
};

var generateQuestions = function(min, max, total) {
  var questions = {};
  var nums = generateRandomNumbers(min, max, total);
  for (const k of nums) {
    questions[k + ""] = new NumbersLine("#test", 65, 80, 10, 80, min, max, k);
  }
  return questions;
};

generateQuestions(0, 100, 5);
