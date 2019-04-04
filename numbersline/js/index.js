var minNumber = 0, maxNumber = 100;

var nums = {};
var count = 0;
while (count < 5) {
    var ran = Math.floor(Math.random() * maxNumber) + minNumber;
    if (!nums["" + ran]) {
        nums["" + ran] = ran;
        count++;
    }
}

var questions = {};
for (var k in nums) {
    questions[k] = new NumbersLine("#test", 50, 50, 10, 50, minNumber, maxNumber, nums[k]);
}

var checkResult = function (e, num) {
    var target = e.target;
    var input = target.previousElementSibling.value;

    var q = questions[num + ""];
    if (q) {
        q.checkResult(input);
    }
}