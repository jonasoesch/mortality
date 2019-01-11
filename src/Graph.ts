import * as d3 from "d3";
import * as glob from "./globals.json"


export class Graph {

    name:string
    description:string
    data:any = null
    chart:d3.Selection<any, any, any, any>
    h:number = glob["height"]
    w:number = glob["width"]
    fontColor:string = glob["fontColor"]
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


    /*
        let graph = new Graph("name")
        graph.setDescription()
        graph.setScales()
        graph.setColors()
        graph.setLabels()
        graph.setLabelOffsets()
        graph.setData()
        graph.draw()
    */

    constructor(name) {
        this.name = name
        this.initStage()
    }


    setDescription(description) {
        this.description = description 
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

    setColors(colors) {
        this.colors = colors
    }

    setLabels(labels) {
        this.labels = labels 
    }

    setData(data) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
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
                d3.area()
                .x(d => this.xScale(d["date"]))
                .y1(d => this.yScale(d[klass]))
                .y0(d => this.yScale(d[klass]))
            )
        })
    }

    draw() {
        if(!this.data) {throw new Error("There is no data yet")}
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
            .call(this.axisLeft(this.xScale, this.w))
        )


        axes.push(
            axesGroup.append("g")
            .attr("class", "axisBottom")
            .attr("transform", `translate(0, ${this.h-this.margin})`)
            .call(this.axisBottom(this.yScale, this.h))
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
        this.classes.forEach( (klass) => {
            this.drawPath(paths, klass)
        })        
    }


    protected drawPath(container:d3.Selection<any,any,any,any>, klass:string) {
            container.append('path')
                .attr("class", klass)
                .attr("d", d => this.getPathFor(klass))
                .attr("stroke", this.getColorFor(klass))
                .attr("fill", this.getColorFor(klass))
    }


    public getColorFor(klass) {
        return this.colors[this.classes.indexOf(klass)]
    }


    public getPathFor(klass) {
        if(this.data == null) {throw new Error("There is no data yet")}
        if(this.paths.length === 0) {throw new Error("No pathGenerators yet")}

        let i = this.classes.indexOf(klass)
        
        if(i === -1) {throw new Error(`There is no class with name ${klass} in ${this.name}`)}
        let ret = this.paths[i](this.data)
        return ret
    }


    protected drawLabels() {
        this.chart.select(".labels").remove()
        let labels = this.chart.append("g").attr("class", "labels")

        this.classes.forEach( (klass, i) => {
            labels.append("rect")
                .datum(this.data)
                .attr("y", d => this.labelYPosition(d, klass, i, -15))
                .attr("x", this.labelXPosition(klass))
                .attr("width", this.labelXWidth(klass))
                .attr("height", 20)
                .attr("fill", this.colors[i])
                .style("font-family", this.font)


            labels.append("text")
                .datum(this.data)
                .text(this.labels[i])
                .attr("y", d =>  this.labelYPosition(d, klass, i, 0))
                .attr("x", this.labelXPosition(klass, 5))
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

    fadeOut() {
        this.chart.select(".paths")
            .transition()
            .style("opacity", 0)
        
        this.chart.select(".label")
            .transition()
            .style("opacity", 0)

        this.chart.select(".description").style("display", "none")
            .transition()
            .style("opacity", 0)
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
        if(data === null) {throw new Error("You passed no data")}
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
         this.classes.forEach( (klass) => {
             this.drawPath(paths, klass)    
         })

    }

    drawPath(container, klass) {
            container.append('path')
                .attr("d", d => this.getPathFor(klass))
                .attr("fill", this.getColorFor(klass))
    }


    getPathFor(klass) {
        let i = this.classes.indexOf(klass)
        let ret = this.paths[i](this.stacks[i])
        return ret
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
