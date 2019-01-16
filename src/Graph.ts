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

    name:string
    description:string
    data:any = null
    chart:d3.Selection<any, any, any, any>


    h:number 
    w:number
    fontColor:string = "#fff"
    font:string = "Fira Sans OT"
    lineWeight = 3
    margin = 80


    xScale:any //scaleTime
    yScale:d3.ScaleLinear<number, number>
    paths:d3.Line<any>[] = []
    marks:Mark[] 

    constructor(name:string) {
        this.name = name
        this.h = this.height()
        this.w = this.width()
        this.initStage()
        this.marks = []
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



    setDescription(description:string) {
        this.description = description 
    }


    yPosition() {
        let offset = window.pageYOffset
        let top = this.chart.node().getBoundingClientRect().top || 0
        console.log(top)
        return top + offset
    }

    addMark(markName:string):Mark {
        let mark = new Mark(markName)
        this.marks.push(mark)
        return mark
    }

    initStage() {
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

    
    setScales(x:[Date, Date], y:[number, number]) {
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


    setData(data:any) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
        this.setMarkNames(data) 
        this.pathGenerators()
    }

    setMarkNames(data:any) {
        let names:string[] = []
        for (let prop in data[0]) {
            if( data[0].hasOwnProperty( prop ) && prop !== "date" ) {
                names.push(prop)
            } 
        }

        if(this.marks != undefined && (this.marks.length > 0)) {
            this.marks.forEach( (prop, i) => {
                prop.name = names[i]
            })
        }
        else {
            this.marks = names.map( (k) => new Mark(k) ) 
        } 
    }

    pathGenerators() {
        this.marks.forEach( mark => {
            this.paths.push(
                d3.area()
                .x(d => this.xScale((d as any)["date"]))
                .y1(d => this.yScale((d as any)[mark.name]))
                .y0(d => this.yScale((d as any)[mark.name]))
            )
        })
    }

    draw() {
        if(!this.data) {throw new Error("There is no data yet")}
        this.unhide()
        this.drawAxes()
        this.drawPaths()
        this.drawLabels()
        if(this.description) { this.drawDescription() }
    }


    protected drawAxes() {

        this.chart.select(".axes").remove()
        let axesGroup = this.chart.append("g").attr("class", "axes")


        let axes = []
        axes.push(
            axesGroup.append("g")
            .attr("class", "axisLeft")
            .attr("transform", `translate(${this.margin}, 0)`)
            .call(this.axisLeft())
        )


        axes.push(
            axesGroup.append("g")
            .attr("class", "axisBottom")
            .attr("transform", `translate(0, ${this.h-this.margin})`)
            .call(this.axisBottom())
        )

        axes.forEach( axis => {
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
        } )
    }

    protected drawPaths() {
        this.chart.select(".paths").remove()
        let paths = this.chart.append("g").attr("class", "paths")
        this.marks.forEach( (mark) => {
            this.drawPath(paths, mark.name)
        })        
    }


    protected drawPath(container:d3.Selection<any,any,any,any>, markName:string) {
        let color = this.getColorFor(markName)
            container.append('path')
                .attr("class", markName)
                .attr("d", d => this.getPathFor(markName))
                .attr("stroke", color)
                .attr("fill", color)
    }


    public getColorFor(markName:string) {
        let col = this.getMark(markName).color
        return col
    }
    
    getMark(markName:string):Mark{
        let ret
        this.marks.forEach( mark => {
            if(mark.name === markName) {
                ret = mark
            }
        })
        return ret
    }


    public getPathFor(markName:string) {
        if(this.data == null) {throw new Error("There is no data yet")}
        if(this.paths.length === 0) {throw new Error("No pathGenerators yet")}

        let i = this.marks.map( k => k.name ).indexOf(markName)
        
        if(i === -1) {throw new Error(`There is no mark with name ${markName} in ${this.name}`)}
        let ret = this.paths[i](this.data)
        return ret
    }


    protected drawLabels() {
        this.chart.select(".labels").remove()
        let labels = this.chart.append("g").attr("class", "labels")

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
