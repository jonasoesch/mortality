import * as d3 from "d3";
import * as glob from "./globals.json"
import {Mark} from './Mark'


/**
 Example usage:
```javascript
let graph = new Graph("name")
graph.setScales( [start_date, end_date], [min, max])
graph.setDescription("This graph shows foo and bar")
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

    /**
     * Creates the d3-Line function that generates the actual path when provided with input data
     * The x-axis is always mapped to the "date" column
     * The y-axis to the markName
     **/
    private pathGeneratorFor(markName:string) {
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
        this.unhide()
        this.drawAxes()
        this.drawMarks()
        this.drawLabels()
        if(this.description) { this.drawDescription() }
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
                .style("font-size", "16px")
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
                .attr("fill", this.getColorFor(mark))
    }


    public getColorFor(mark:Mark) {
        return mark.color
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


    public getPathFor(markName:string):string {

        let mark = this.getMark(markName)

        if(this.data == null) {throw new Error("There is no data yet")}
        if(mark.pathGenerator === null) {throw new Error("No pathGenerator yet")}

        return mark.pathGenerator(this.data)
    }


    protected drawLabels() {
        let labels = this.clearStagePart("labels")

        this.marks.forEach( (mark, i) => {
            labels.append("rect")
                .datum(this.data)
                .attr("y", d => this.labelYPosition(d, mark.name, i, -15))
                .attr("x", this.labelXPosition(mark.name))
                .attr("width", this.labelXWidth(mark.name))
                .attr("height", 20)
                .attr("fill", this.marks[i].color)
                .style("font-family", this.font)


            labels.append("text")
                .datum(this.data)
                .text(this.marks[i].label)
                .attr("y", d =>  this.labelYPosition(d, mark.name, i, 0))
                .attr("x", this.labelXPosition(mark.name, 5))
                .attr("fill", "white")
                .style("font-family", this.font)
                .style("font-weight", "bold")
        } )
        
        this.removeFill()
    }




    protected drawDescription() {
        this.chart.select("description")
        this.chart
            .append("text")
            .attr("class", "description")
            .attr("x", this.margin + 10)
            .attr("y", 30)
            .attr("fill", "white")
            .style("font-size", "16px")
            .style("font-family", this.font)
            .style("font-weight", "bold")
            .text(this.description)
    }

    hide() {
        this.chart
            .transition()
            .duration(100)
            .style("opacity", 0)
    }

    unhide() {
        this.chart
            .transition()
            .duration(100)
            .style("opacity", 1)
    }

    labelXWidth(markName:string) {
        return 70
                - this.getMark(markName).labelOffsets[0]
    }

    labelYPosition(d:any, markName:string, i:number, offset=0):number {
        return this.yScale(d[d.length-1][markName]) + offset + this.getMark(markName).labelOffsets[1]
    }

     labelXPosition(markName:string, offset=0):number {
        return this.w-this.margin + offset + this.getMark(markName).labelOffsets[0]
     }

    removeFill() {
        let paths = this.chart.select(".paths")
        paths.selectAll("path")
            .attr("stroke-width", this.lineWeight)
            .attr("fill", "none")
    }


    protected axisLeft() {
        return this.formatLeftAxis(d3.axisLeft(this.yScale).tickSize(-this.w).tickPadding(10))
    }

    private axisBottom() {
        return d3.axisBottom(this.xScale).tickSize(-this.h).tickPadding(10)
    }

    formatLeftAxis(axis:d3.Axis<any>) {
        return axis 
    }

}
