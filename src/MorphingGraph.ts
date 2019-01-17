import * as d3 from 'd3';
import {Graph} from './Graph';
import {MorphingMark, Mark} from './Mark'
import interpolatePath from './interpolate-path';

export class MorphingGraph extends Graph {
    name:string
    originGraph:Graph
    originDomain:number[]

    targetGraph:Graph
    targetDomain:number[]


    howFar:number

    stage:d3.Selection<any, any, any, any>
        transitions:string[][]
    _pathInterpolators:Function[]



    /*
     * This chart needs no data but is based on two existing graphs
     * mg = new MorpingGraph("name")
     * mg.setOrigin(g1)
     * mg.setTarget(g2)
     * mg.addTransition("a", "b")
     * mg.atPoint(0.5).draw()
     */

    constructor(name:string) {
        super(name)
        this.marks = []
        this.name = name 
    }

    public setOrigin(graph:Graph) {
        this.originGraph = graph     
        this.originDomain = graph.yScale.domain()

        // Initialize everything with the origin graph
        this.setScales(graph.xScale.domain(), (graph.yScale.domain() as [number, number]))
        this.setData(graph.data)
    }

    drawLabels() {}


    public setTarget(graph:Graph) {
        this.targetGraph = graph
        this.targetDomain = graph.yScale.domain()
    }


    addTransition(from:string, to:string) {
        let prop = new MorphingMark(`${from}---${to}`)
        prop.from = this.originGraph.getMark(from)
        prop.to = this.targetGraph.getMark(to)
        this.marks.push(prop)
    }


    public atPoint(howFar:number) {
        this.howFar = howFar 
        return this
    }


    public draw() {
        super.draw()
        let start = this.originGraph.yPosition()
        let end = this.targetGraph.yPosition()
        let interpolator = d3.interpolate(start, end)
        debugger;
        console.log(interpolator(this.howFar))
        this.chart
            .attr("transform", `translate(0, ${interpolator(this.howFar)})`)
    }

    drawAxes() {}
    


    getPathFor(markName:string) {
        let from = this.fromToClasses(markName).from
        let to = this.fromToClasses(markName).to


        let path1 = this.originGraph.getPathFor(from)
        let path2 = this.targetGraph.getPathFor(to)

        return interpolatePath(path1, path2, null)(this.howFar)
    }


    getColorFor(mark:MorphingMark) {
        let color1 = mark.from.color
        let color2 = mark.to.color
        return d3.interpolateHsl(color1, color2)(this.howFar)
    }

    protected axisLeft() {
        let originDomain = this.originGraph.yScale.domain()
        let targetDomain = this.targetGraph.yScale.domain()
        let interpolator = d3.interpolate(originDomain, targetDomain)

        let yScale = d3.scaleLinear()
            .domain(interpolator(this.howFar))
            .range(this.originGraph.yScale.range())


        return this.formatLeftAxis(d3.axisLeft(yScale).tickSize(-this.w).tickPadding(10))
    }

    private fromToClasses(markName:string) {
        let pair = markName.split("---") 
        if(pair.length !== 2) {throw new Error("Need two properties to interpolate between")}
        return {from: pair[0], to: pair[1]}
    }

}


