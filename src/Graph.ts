import * as d3 from "d3";
import * as glob from "./globals.json"

export class Graph {

    name:string
    description:string
    data:any = null
    chart:d3.Selection<any, any, any, any>
    h:number = glob["height"]
    w:number = glob["width"]
    color:string = glob["fontColor"]
    font:string = glob["fontFamily"]
    lineWeight = 3
    margin = 80
    xScale:any //scaleTime
    yScale:d3.ScaleLinear<number, number>
    colors:string[] = []
    paths:d3.Line<any>[] = []
    classes:string[] = []
    labels:string[] = []
    labelOffsets:number[][] = null
    animated:d3.Selection<any, any, any, any>[]

    constructor(name) {
        this.name = name
        this.setStage()
    }


    setDescription(description) {
        this.description = description 
    }

    setStage() {
        this.insertChart()
        this.setDimensions()
    }

    insertChart() {
        this.chart = d3.select(`#${this.name}`)
            .append("svg")
    }

    setDimensions() {
        this.chart
            .attr("width", this.w)
            .attr("height", this.h)
    }

    setScales(x:[Date, Date], y:[number, number]) {
        this.setYScale(y) 
        this.setXScale(x) 
    }

    private setXScale(domain:[Date, Date]) {
        this.xScale = d3.scaleTime()
            .domain(domain)
            .range([this.margin, this.w-this.margin])
    }

    private setYScale(domain:[number, number]) {
        this.yScale = d3.scaleLinear()
            .domain(domain)
            .range([this.h-this.margin, this.margin])
    }

    setColors(colors) {
        this.colors = colors
    }

    setLabels(labels) {
        this.labels = labels 
    }

    setData(data) {
        this.setClasses(data) 
        this.pathGenerators()
    }

    setClasses(data) {
        for (let prop in data[0]) {
            if( data[0].hasOwnProperty( prop ) && prop !== "date" ) {
                this.classes.push(prop)
            } 
        }
    }

    pathGenerators() {
        this.classes.forEach( klass => {
            this.paths.push(
                d3.line()
                .y(d => this.yScale(d[klass]))
                .x(d => this.xScale(d["date"]))
            )
        })
    }

    draw() {
        if(!this.data) {
            throw "There is no data yet"
        }
        this.drawAxes()
        this.drawPaths(this.data)
        this.drawLabels(this.data)
        if(this.description) { this.drawDescription() }
    }


    drawAxes() {
        let axes = []
        axes.push(
            this.chart.append("g")
            .attr("class", "axisLeft")
            .attr("transform", `translate(${this.margin}, 0)`)
            .call(this.axisLeft(this.xScale, this.w))
        )


        axes.push(
            this.chart.append("g")
            .attr("class", "axisBottom")
            .attr("transform", `translate(0, ${this.h-this.margin})`)
            .call(this.axisBottom(this.yScale, this.h))
        )

        axes.forEach( axis => {
            axis.selectAll("line")
                .attr("stroke", d3.color(this.color).darker(4).toString())
                .style("stroke-width",  this.lineWeight)

            axis.selectAll("text")
                .attr("fill", d3.color(this.color).darker(1).toString())
                .style("font-size", "16px")
                .style("font-family", this.font)
                .style("font-weight", "bold")

            axis.selectAll("path")
                .attr("stroke", "none")
        } )
    }

    drawPaths(data) {
        let paths = this.chart.append("g").attr("class", "paths")

        this.paths.forEach( (generator, i) => {
            paths.append('path')
                .datum(data)
                .attr("class", this.classes[i])
                .attr("d", d => generator(<any>d))
                .attr("stroke", this.colors[i])
        })        
    }


    drawLabels(data) {
        let paths = this.chart.select(".paths")
        this.classes.forEach( (klass, i) => {
            paths.append("rect")
                .datum(data)
                .attr("y", d => this.labelYPosition(d, klass, i, -15))
                .attr("x", this.labelXPosition(klass))
                .attr("width", this.labelXWidth(klass))
                .attr("height", 20)
                .attr("fill", this.colors[i])
                .style("font-family", this.font)


            paths.append("text")
                .datum(data)
                .text(this.labels[i])
                .attr("y", d =>  this.labelYPosition(d, klass, i, 0))
                .attr("x", this.labelXPosition(klass, 5))
                .attr("fill", "white")
                .style("font-family", this.font)
                .style("font-weight", "bold")
        } )
        
        this.removeFill()
    }


    drawDescription() {
        this.chart
            .append("text")
            .attr("x", this.margin + 10)
            .attr("y", 30)
            .attr("fill", "white")
            .style("font-size", "16px")
            .style("font-family", this.font)
            .style("font-weight", "bold")
            .text(this.description)
    }

    setAnimated(list) {
        this.animated =
            list.map( (selector) => {
            return this.chart.select(`.${selector}`)
        })         
    }

    setLabelOffsets(labelOffsets:number[][]) {
        this.labelOffsets = labelOffsets 
    }

    labelXWidth(klass:string) {
        return 70
                - (this.labelOffsets ? this.labelOffsets[this.classes.indexOf(klass)][0] : 0)
    }

    labelYPosition(d, klass:string, i:number, offset=0):number {
        return this.yScale(d[d.length-1][klass]) + offset + (this.labelOffsets ? this.labelOffsets[this.classes.indexOf(klass)][1] : 0)
    }

     labelXPosition(klass:string, offset=0):number {
        return this.w-this.margin + offset + (this.labelOffsets ? this.labelOffsets[this.classes.indexOf(klass)][0] : 0)


     }

    removeFill() {
        let paths = this.chart.select(".paths")
        paths.selectAll("path")
            .attr("stroke-width", this.lineWeight)
            .attr("fill", "none")
    }


    private axisLeft(scale, w) {
        return this.formatLeftAxis(d3.axisLeft(this.yScale).tickSize(-this.w).tickPadding(10))
    }

    private axisBottom(scale, h) {
        return d3.axisBottom(this.xScale).tickSize(-this.h).tickPadding(10)
    }

    formatLeftAxis(axis:d3.Axis<any>) {
        return axis 
    }

}

export class StackedGraph extends Graph {
    stacks:any;
    dates:Date;


    setData(data) {
        this.data = data
        this.pathGenerators()
        this.stacks = (d3.stack()
            .keys(this.classes))(<any>data)
        this.dates = data.map( d => d.date)
    }


    pathGenerators() {
        this.classes.forEach( klass => {
            this.paths.push(
                d3.area()
                .x((stack, i) => this.xScale(this.dates[i]))
                .y1(d => this.yScale(d[1] || 1))
                .y0(d => this.yScale(d[0]))
            )
        })
    }

     drawPaths() {
        let paths = this.chart.append("g").attr("class", "paths")

        this.paths.forEach( (generator, i) => {
            paths.append('path')
                .datum(this.stacks[i])
                .attr("d", d => generator(d))
                .attr("fill", this.colors[i])
        })        
    }



    setClasses(classes) {
        this.classes = classes
    }


    removeFill() {}
    
    labelYPosition(d, klass:string, i:number, offset) {
        return this.yScale(this.stacks[i][this.stacks[i].length-1][1] || 1) 
            + 20
            + offset 
            + (this.labelOffsets ? this.labelOffsets[this.classes.indexOf(klass)][1] : 0)
    }




}
