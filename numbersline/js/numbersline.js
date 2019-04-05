class NumbersLine {
  constructor(
    parent,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    minNumber,
    maxNumber,
    randomNumber
  ) {
    this._randomNumber = randomNumber;
    this._parent = parent;
    this._minNumber = minNumber;
    this._maxNumber = maxNumber;

    var parentElement = d3.select(parent);

    var margin = {
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft
      },
      width = parentElement.node().getBoundingClientRect().width,
      height = parentElement.node().getBoundingClientRect().height;

    this._margin = margin;
    this._width = width;
    this._height = height;

    var xScale = d3
      .scaleLinear()
      .domain([minNumber, maxNumber])
      .range([0, width]);

    this._xScale = xScale;

    var yScale = d3
      .scaleLinear()
      .domain([0, height])
      .range([height, 0]);

    this._yScale = yScale;

    this._svg = d3
      .select(parent)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this._tickValues = [
      minNumber,
      (minNumber + maxNumber) / 2,
      maxNumber,
      randomNumber
    ];

    (this._inputBoxWidth = 120),
      (this._inputBoxHeight = 30),
      (this._inputBoxTop = 80),
      (this._inputBoxSize =
        (Math.max(Math.abs(minNumber), Math.abs(maxNumber)) + "").length + 1);

    this._html = this.getInputHtml();

    this._arrow = this._svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"])
      .enter()
      .append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .attr("fill", "orange")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    this._from = {
      x: this._randomNumber,
      y: this._inputBoxTop - this._inputBoxHeight
    };

    this._to = {
      x: this._randomNumber,
      y: 20
    };

    this._lineGenerator = d3
      .line()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      });

    console.log(randomNumber);

    this.renderX();
    this.renderY();
    this.renderInputBox();
    this.renderArrow();
  }

  get number() {
    return this._randomNumber;
  }

  get xAxis() {
    return this._xAxis;
  }

  set xAxis(axis) {
    this._xAxis = axis;
  }

  getInputHtml(value) {
    return (
      '<div xmlns="http://www.w3.org/2000/svg" style="width: 100px;height: 100%;display:table;vertical-align:middle;line-height: 30px;position: relative;">' +
      '<input style="font-size: 20px;box-shadow: inset 0 0 10px grey;width:60px;" maxlength="' +
      this._inputBoxSize +
      '" ' +
      (value == undefined ? "" : "value=" + value) +
      "></input>" +
      '<button style="width:50px;height:28px;top: 0px;position: absolute;">CHECK</button>' +
      "</div>"
    );
  }

  formatQuestionMark() {
    var randomNumber = this._randomNumber;
    return function(num) {
      if (num == randomNumber) {
        return "?";
      } else {
        return num;
      }
    };
  }

  renderInputBox(input) {
    this._questionMark = this._xAxis.selectAll("g").filter(function() {
      return (
        d3
          .select(this)
          .select("text")
          .text() == "?"
      );
    });

    this._inputBox = this._questionMark
      .append("foreignObject")
      .attr("width", this._inputBoxWidth)
      .attr("height", this._inputBoxHeight)
      .attr(
        "transform",
        "translate(" + -this._inputBoxWidth / 2 + "," + -this._inputBoxTop + ")"
      )
      .html(this._html);

    var that = this;
    this._inputBox.select("input").on("keypress", function() {
      if (d3.event && d3.event.code === "Enter") {
        that.checkResult(d3.event.target.value);
      }
    });

    this._inputBox.select("button").on("click", function() {
      if (d3.event) {
        that.checkResult(d3.event.target.previousElementSibling.value);
      }
    });
  }

  renderArrow() {
    this._svg
      .append("path")
      .datum([this._from, this._to])
      .attr("class", "line")
      .attr("d", this._lineGenerator)
      .attr("marker-end", "url(#end)");
  }

  renderX() {
    this._xAxis = this._svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this._height + ")")
      .call(
        d3
          .axisTop(this._xScale)
          .tickValues(this._tickValues)
          .tickFormat(this.formatQuestionMark())
      );
  }

  renderY() {
    this._svg
      .append("g")
      .attr("class", "y axis")
      .style("display", "none")
      .call(d3.axisLeft(this._yScale).ticks(0));
  }

  showTips(answer) {
    this._html = this.getInputHtml(answer);
    this._tickValues = d3.range(
      this._minNumber,
      this._maxNumber,
      (this._maxNumber - this._minNumber) / 20
    );
    this._tickValues.push(this._maxNumber);
    this._tickValues.push(this._randomNumber);

    this._xAxis.call(
      d3
        .axisTop(this._xScale)
        .tickValues(this._tickValues)
        .tickFormat(this.formatQuestionMark())
    );
    this._xAxis
      .selectAll("g")
      .transition("fadein")
      .style("stroke", "red")
      .attr("stroke-width", 3)
      .duration(400)
      .transition("fadeout")
      .attr("stroke-width", 1)
      .duration(400);
    this.renderInputBox();
  }

  checkResult(answer) {
    if (answer === "") return;
    const diff = Math.abs(answer - this._randomNumber);

    if (diff <= 0.5) {
      alert("perfect!");
      this.showTips(answer);
    } else if (diff <= 5) {
      alert("awesome!");
      this.showTips(answer);
    } else if (diff <= 10) {
      alert("good!");
      this.showTips(answer);
    } else if (diff <= 20) {
      alert("fine!");
      this.showTips(answer);
    } else {
      alert("Try again pls !");
    }
  }
}
