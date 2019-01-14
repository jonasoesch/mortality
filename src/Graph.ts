import * as d3 from "d3";
import * as glob from "./globals.json"
import {Property} from './Property'

export class Graph {

    name:string
    description:string
    data:any = null
    chart:d3.Selection<any, any, any, any>


    h:number = (glob as any)["height"]
    w:number = (glob as any)["width"]
    fontColor:string = (glob as any)["fontColor"]
    font:string = (glob as any)["fontFamily"]
    lineWeight = 3
    margin = 80


    xScale:any //scaleTime
    yScale:d3.ScaleLinear<number, number>
    paths:d3.Line<any>[] = []
    classes:Property[] 

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

    constructor(name:string) {
        this.name = name
        this.initStage()
        this.classes = []
    }


    setDescription(description:string) {
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

    setColors(colors:string[]) {
        this.classes = this.classes.length > 0 ? this.classes : colors.map( c => new Property()) 
        this.classes.forEach( (klass, i) => {
            klass.color = colors[i] 
        })
    }

    setLabels(labels:string[]) {
        this.classes = this.classes ? this.classes : labels.map( label => new Property() )
        this.classes.forEach((klass, i) => {
            klass.label = labels[i] 
        })
    }

    setData(data:any) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
        this.setClasses(data) 
        this.pathGenerators()
    }

    setClasses(data:any) {
        let classNames:string[] = []
        for (let prop in data[0]) {
            if( data[0].hasOwnProperty( prop ) && prop !== "date" ) {
                classNames.push(prop)
            } 
        }

        if(this.classes != undefined && (this.classes.length > 0)) {
            this.classes.forEach( (prop, i) => {
                prop.name = classNames[i]
            })
        }
        else {
            this.classes = classNames.map( (k) => new Property(k) ) 
        } 
    }

    pathGenerators() {
        this.classes.forEach( klass => {
            this.paths.push(
                d3.area()
                .x(d => this.xScale((d as any)["date"]))
                .y1(d => this.yScale((d as any)[klass.name]))
                .y0(d => this.yScale((d as any)[klass.name]))
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
        this.classes.forEach( (klass) => {
            this.drawPath(paths, klass.name)
        })        
    }


    protected drawPath(container:d3.Selection<any,any,any,any>, klass:string) {
        let color = this.getColorFor(klass)
            container.append('path')
                .attr("class", klass)
                .attr("d", d => this.getPathFor(klass))
                .attr("stroke", color)
                .attr("fill", color)
    }


    public getColorFor(klass:string) {
        let col = this.getPropertyFor(klass).color
        return col
    }
    
    getPropertyFor(klass:string):Property{
        let ret
        this.classes.forEach( prop => {
            if(prop.name === klass) {
                ret = prop
            }
        })
        return ret
    }


    public getPathFor(klass:string) {
        if(this.data == null) {throw new Error("There is no data yet")}
        if(this.paths.length === 0) {throw new Error("No pathGenerators yet")}

        let i = this.classes.map( k => k.name ).indexOf(klass)
        
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
                .attr("y", d => this.labelYPosition(d, klass.name, i, -15))
                .attr("x", this.labelXPosition(klass.name))
                .attr("width", this.labelXWidth(klass.name))
                .attr("height", 20)
                .attr("fill", this.classes[i].color)
                .style("font-family", this.font)


            labels.append("text")
                .datum(this.data)
                .text(this.classes[i].label)
                .attr("y", d =>  this.labelYPosition(d, klass.name, i, 0))
                .attr("x", this.labelXPosition(klass.name, 5))
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
            .style("opacity", 0)
    }

    unhide() {
        this.chart
            .style("opacity", 1)
    }


    setLabelOffsets(labelOffsets:number[][]) {
        this.classes = this.classes.length > 0 ? this.classes : labelOffsets.map(lo => new Property())
        this.classes.forEach( (prop, i) => {
            this.classes[i].labelOffsets = labelOffsets[i] 
        })
    }

    labelXWidth(klass:string) {
        return 70
                - this.getPropertyFor(klass).labelOffsets[0]
    }

    labelYPosition(d:any, klass:string, i:number, offset=0):number {
        return this.yScale(d[d.length-1][klass]) + offset + this.getPropertyFor(klass).labelOffsets[1]
    }

     labelXPosition(klass:string, offset=0):number {
        return this.w-this.margin + offset + this.getPropertyFor(klass).labelOffsets[0]
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
