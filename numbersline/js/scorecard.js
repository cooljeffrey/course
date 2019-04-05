class ScoreCard {
  constructor(parentSelection, x, y, w, h, score) {
    this._svg = parentSelection;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._score = score;

    this.defineShadowFilter();
  }

  defineShadowFilter() {
    var filter = this._svg
      .select("defs")
      .append("filter")
      .attr("id", "coolShadow")
      .attr("y", "-20%")
      .attr("height", "140%");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 1.7)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");

    filter
      .append("feFlood")
      .attr("flood-color", "#FFDF00")
      .attr("flood-opacity", "0.5")
      .attr("result", "offsetColor");

    filter
      .append("feComposite")
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
  }

  layout() {
    this._card = this._svg
      .append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("x", this._x)
      .attr("y", this._y)
      .attr("width", this._w)
      .attr("height", this._h)
      .style("fill", d3.rgb(225, 223, 224))
      .style("stroke", "gold")
      .style("filter", "url(#coolShadow)");

    this._text = this._svg
      .append("text")
      .attr("x", this._x + this._w / 2)
      .attr("y", this._y + this._h / 2)
      .attr("width", this._w)
      .attr("height", this._h)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .text(this.getScoreTitle())
      .style("font-size", "24px")
      .style("fill", "black")
      .style("stroke-width", 10)
      .style("stroke-opacity", 1)
      .attr("transform", this._svg.attr("transform"));
  }

  getScoreTitle() {
    switch (this._score) {
      case 10:
        return "Perfect!";
      case 9:
        return "Awesome!";
      case 8:
        return "Very Good!";
      case 7:
        return "Good!";
      default:
        return "Try Again ?";
    }
  }

  show() {
    if (!this._card) this.layout();
    this._card
      .transition("easeElastic")
      .ease(d3.easeElastic)
      .attr("width", this._w)
      .attr("height", this._h)
      .duration(500)
      .attr("transform", this._svg.attr("transform"));
  }

  destroy() {}
}
