import * as d3 from "d3";
import * as glob from "./globals.json"
import {Mark} from './Mark'

/**
 Example usage:
```javascript
let graph = new Graph("name")
graph.setScales( [start_date, end_date], [min, max])
graph.setDescription("This graph shows foo and bar")
graph.setAxisLabels("y-Axis")
graph.addMark("foo")
     .setColor("red")
     .setLabel("Foo")
     .setLabelOffsets([0,13])
graph.setData(data)
```
 **/

export class Graph {

    /** 
     * Defines the HTMLElement where the chart should be
     * drawn. The HTMLElement must have an id of "name"
     * so that the chart can be inserted there
     **/
    name:string
    description:string
    yAxisLabel:string = ""
    data:any = null
    chart:d3.Selection<any, any, any, any>


        /** 
         * Height `h` is taken from the containing HTMLElement defined by `name`
         **/
    h:number 
    /** Width `w` is taken from the containing HTMLElement defined by `name`**/
    w:number


    fontColor:string = "#fff"
    font:string = "Fira Sans OT"
    fontSizing = 1;
    lineWeight = 3
    margin = 80


    xScale:any //scaleTime
    yScale:d3.ScaleLinear<number, number>

        /*
         * The marks that should be drawn in the chart.
         * For example lines or areas.
         * Only the definition is stored in a Mark.
         * The Graph class is responsible for drawing it
         * with a given dataset
         **/
        marks:Mark[] 

    /////////// Initialization /////////////////

    constructor(name:string) {
        this.name = name
        this.h = this.height() || 720
        this.w = this.width() || 1280
        this.marks = []
        this.initStage()
    }

    public cloneWithNewName(name:string):Graph {
        let clone = new Graph(name)
        clone.setScales(this.xScale.domain(), <[number, number]>this.yScale.domain())
        clone.setDescription(this.description)
        clone.setAxisLabels(this.yAxisLabel)
        this.marks.forEach( mark => clone
            .addMark(mark.name)
            .setColor(mark.color) 
            .setLabel(mark.label)
            .setLabelOffsets(mark.labelOffsets)
        )
        clone.setData(this.data)
        return clone
    }

    protected container():HTMLElement {
        return document.getElementById(this.name) 
    }

    protected width() {
        return this.container().getBoundingClientRect().width
    }

    protected height() {
        return this.container().getBoundingClientRect().height
    }


    /**
     * Adds an SVG with the right dimensions
     * into the containing element
     **/
    private initStage() {
        this.insertChart()
        this.setDimensions()
    }

    private insertChart() {
        this.chart = d3.select(`#${this.name}`)
            .append("svg")
            .attr("id", `svg-${this.name}`)
    }

    private setDimensions() {
        this.chart
            .attr("width", this.w)
            .attr("height", this.h)
    }


    ///////////////// Configuration //////////////////////

    public setDescription(description:string) {
        this.description = description 
    }

    public setAxisLabels(y) {
        this.yAxisLabel = y
    }


    /**
     * Adds a mark with a given name and directly returns it.
     * This makes mathod chaining possible like this:
     * ```javascript
     * graph.addMark("mark")
     * .setColor("red")
     * .setLabel("A Mark")
     * ```
     **/
    public addMark(markName:string):Mark {
        let mark = new Mark(markName)
        mark.pathGenerator = this.pathGeneratorFor(markName)
        this.marks.push(mark)
        return mark
    }


    public removeMark(markName:string) {
        this.marks = this.marks.filter( mark => mark.name !== markName )
    }


    /**
     * Find a mark by its name
     **/
    public getMark(markName:string):Mark{
        let found = undefined
        this.marks.forEach( mark => {
            if(mark.name === markName) {
                found = mark
            }
        })
        return found
    }


    /**
     * Creates the d3-Line function that generates the actual path when provided with input data
     * The x-axis is always mapped to the "date" column
     * The y-axis to the markName
     **/
    protected pathGeneratorFor(markName:string) {
        return d3.area()
            .x(d => this.xScale((d as any)["date"]))
            .y1(d => this.yScale((d as any)[markName]))
            .y0(d => this.yScale((d as any)[markName]))
    }

    /**
     * Defines the data domains that should be mapped to
     * the width `w` and the height `h` of the graph
     **/
    public setScales(x:[Date, Date], y:[number, number]) {
        this.setYScale(y) 
        this.setXScale(x) 
    }

    protected setXScale(domain:[Date, Date]) {
        this.xScale = d3.scaleTime()
            .domain(domain)
            .range([this.margin, this.w-this.margin])
    }

    protected setYScale(domain:[number, number]) {
        this.yScale = d3.scaleLinear()
            .domain(domain)
            .range([this.h-this.margin, this.margin])
    }

    public setData(data:any) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
    }



    ///////////////////// Drawing ////////////////////////////

    /**
     * The draw function will create an SVG with the specification of the
     * Graph and it's Marks
     **/
    draw() {
        if(!this.data) {throw new Error("Can't draw. There is no data yet")}
        let t1 = new Date().getTime()
        this.drawAxes()
        let t2 = new Date().getTime()
        this.drawMarks()
        let t3 = new Date().getTime()
        this.drawLabels()
        let t4 = new Date().getTime()
        if(this.description) { this.drawDescription() }
        this.unhide()
        let t5 = new Date().getTime()
        //console.table([{axes: t2-t1, marks: t3-t2, labels: t4-t3, unhide:t5-t4}])
    }

    /**
     * Removes and re-adds the group containing
     * a certain type of visual elements (axes, marks, labels, …). This
     * effectively clears the stage before redrawing
     * the respective elements
     **/
    protected clearStagePart(stagePart:string):d3.Selection<any,any,any,any> {
        this.chart.select(`.${stagePart}`).remove()
        return this.chart.append("g").attr("class", stagePart)
    }


    protected drawAxes() {

        let axesGroup = this.clearStagePart("axes") 

        let axisLeft = axesGroup.append("g")
            .attr("class", "axisLeft")
            .attr("transform", `translate(${this.margin}, 0)`)
            .call(this.axisLeft())

        this.styleAxis(axisLeft)

        let axisBottom = axesGroup.append("g")
            .attr("class", "axisBottom")
            .attr("transform", `translate(0, ${this.h-this.margin})`)
            .call(this.axisBottom())

        this.styleAxis(axisBottom)

        this.drawAxisLabels()

    }


    /**
     * Wrap access to y-axis to
     * make it extensible
     **/
    protected axisLeft() {
        return this.formatLeftAxis(d3.axisLeft(this.yScale).tickSize(-this.w+2*this.margin).tickPadding(10))
    }

    /**
     * Wrap access to x-axis to
     * make it extensible
     **/
    protected axisBottom() {
        return d3.axisBottom(this.xScale).tickSize(-this.h+2*this.margin).tickPadding(10)
    }

    /**
     * Wrap the y-axis into a formatting-function
     * so subclasses can define their own formatting
     **/
    protected formatLeftAxis(axis:d3.Axis<any>) {
        return axis 
    }


    private fontSize(basesize) {
        return basesize * this.fontSizing
    }


    /**
     * Styles a given axis by setting e. g. the font-size
     * or stroke-color
     **/
    protected styleAxis(axis:d3.Selection<any,any,any,any>) {
        axis.selectAll("line")
            .attr("stroke", d3.color(this.fontColor).darker(4).toString())
            .style("stroke-width",  this.lineWeight)

        axis.selectAll("text")
            .attr("fill", d3.color(this.fontColor).darker(1).toString())
            .style("font-size", this.fontSize(16))
            .style("font-family", this.font)
            .style("font-weight", "bold")

        axis.selectAll("path")
            .attr("stroke", "none")
    }


    protected drawMarks() {
        let paths = this.clearStagePart("paths")
        this.marks.forEach( (mark) => {
            this.drawMark(paths, mark)
        })        
    }


    protected drawMark(container:d3.Selection<any,any,any,any>, mark:Mark) {
        container.append('path')
            .attr("class", mark.name)
            .attr("d", d => this.getPathFor(mark.name))
            .attr("stroke", this.getColorFor(mark))
            .attr("stroke-width", this.lineWeight)
            .attr("fill", this.getColorFor(mark))
    }


    /**
     * Wraps access to the mark color
     * so it stays extensible
     **/
    public getColorFor(mark:Mark) {
        return mark.color
    }


    /**
     * Wraps access to a marks path
     * so it stays extensible.
     * The selector is a string which makes testing easier
     **/
    public getPathFor(markName:string):string {
        let mark = this.getMark(markName)

        if(mark === undefined) {throw new Error(`There is no mark named ${markName}`)}
        if(this.data == null) {throw new Error("There is no data yet")}
        if(mark.pathGenerator === null) {throw new Error(`There is no pathGenerator for mark ${markName}`)}

        return mark.pathGenerator(this.data)
    }


    protected drawLabels() {
        let labels = this.clearStagePart("labels")

        this.marks.forEach( (mark, i) => {
            labels.append("rect")
                .attr("y",this.labelYPosition(mark, -15))
                .attr("x", this.labelXPosition(mark))
                .attr("width", this.labelXWidth(mark))
                .attr("height", this.fontSize(20))
                .attr("fill", this.marks[i].color)
                .style("font-family", this.font)

            labels.append("text")
                .text(this.marks[i].label)
                .attr("y", this.labelYPosition(mark, 0))
                .attr("x", this.labelXPosition(mark, 3))
                .attr("fill", this.fontColor)
                .style("font-family", this.font)
                .style("font-weight", "bold")
                .style("font-size", this.fontSize(16))

        } )

    }
    
private measureText(str, fontSize = 10) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0666656494140625,0.46666717529296875,0.6566665649414063,0.7,0.7033340454101562,1.05,0.976666259765625,0.475,0.525,0.525,0.6416671752929688,0.7,0.46666717529296875,0.6066665649414062,0.46666717529296875,0.7199996948242188,0.7600006103515625,0.6,0.7066665649414062,0.7033340454101562,0.723333740234375,0.7166671752929688,0.7350006103515625,0.6449996948242187,0.7566665649414063,0.7350006103515625,0.46666717529296875,0.46666717529296875,0.7,0.7,0.7,0.7066665649414062,1.2199996948242187,0.7783340454101563,0.8300003051757813,0.773333740234375,0.8566665649414062,0.7416671752929688,0.698333740234375,0.8383331298828125,0.8816665649414063,0.5066665649414063,0.5100006103515625,0.7949996948242187,0.7033340454101562,0.9966659545898438,0.8883331298828125,0.9,0.7883331298828125,0.9,0.8066665649414062,0.7449996948242188,0.7166671752929688,0.875,0.7850006103515625,1.0316665649414063,0.7566665649414063,0.75,0.723333740234375,0.525,0.7199996948242188,0.525,0.7199996948242188,0.7199996948242188,0.498333740234375,0.748333740234375,0.7916671752929687,0.6783340454101563,0.798333740234375,0.748333740234375,0.598333740234375,0.7283340454101562,0.7883331298828125,0.47833404541015623,0.48833465576171875,0.7166671752929688,0.49166717529296877,1.0633331298828126,0.7883331298828125,0.7850006103515625,0.7916671752929687,0.798333740234375,0.5850006103515625,0.673333740234375,0.5666671752929687,0.7816665649414063,0.6949996948242188,0.9316665649414062,0.6783340454101563,0.6916671752929687,0.6416671752929688,0.525,0.6033340454101562,0.525,0.7]
  const avg = 0.7047721140008222
  return str
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize
}

    protected labelXWidth(mark:Mark) {
        return this.measureText(mark.label, 12) + 8 //offset
    }

    public labelYPosition(mark:Mark, offset=0):number {
        return this.yScale(this.data[this.data.length-1][mark.name]) 
            + offset * this.fontSizing
            + mark.labelOffsets[1]
    }

    protected labelXPosition(mark:Mark, offset=0):number {
        return this.w
            - this.margin 
            + offset 
            + mark.labelOffsets[0]
    }


    protected drawDescription() {
        let description = this.clearStagePart("description")
        description
            .append("text")
            .attr("x", (this.w/2) - this.margin - this.measureText(this.description)/2+20)
            .attr("y", 50)
            .attr("fill", this.fontColor)
            .style("font-size", this.fontSize(18))
            .style("font-family", this.font)
            .style("font-weight", "bold")
            .text(this.description)
    }

    protected drawAxisLabels() {
        let axisLabels = this.clearStagePart("axisLabels") 
        axisLabels
            .append("text")
            .attr("x", this.margin/2)
            .attr("y", 50)
            .attr("fill", d3.color(this.fontColor).darker(1).toString())
            .style("font-size", this.fontSize(12))
            .style("font-family", this.font)
            .style("font-weight", "bold")
            .text(this.yAxisLabel)
    }


    /**
     * Hide the whole graph
     **/
    hide() {
        this.chart
            //.transition()
            //.duration(100)
            .style("opacity", 0)
    }

    /**
     * Show the whole graph (typically used after hiding it)
     **/
    unhide() {
        this.chart
            //.transition()
            //.duration(500)
            .style("opacity", 1)
    }
}
