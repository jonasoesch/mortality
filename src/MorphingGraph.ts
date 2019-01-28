import * as d3 from 'd3';
import {Graph} from './Graph';
import {MorphingMark, Mark} from './Mark'

export class MorphingGraph extends Graph {
    name:string
    originGraph:Graph
    originDomain:number[]

    targetGraph:Graph
    targetDomain:number[]


    howFar:number

    /*
     * This chart needs no data but is based on two existing graphs
     * mg = new MorpingGraph("name")
     * mg.setOrigin(g1)
     * mg.setTarget(g2)
     * mg.addTransition("a", "b")
     * mg.atPoint(0.5).draw()
     */


    /**
     * Sets the graph from which the interpolation
     * should start. The MorphingGraph is initialized with
     * the values of this graph.
     **/
    public setOrigin(graph:Graph) {
        this.originGraph = graph     
        this.originDomain = graph.yScale.domain()

        // Initialize everything with the origin graph
        this.setScales(graph.xScale.domain(), (graph.yScale.domain() as [number, number]))
        this.setData(graph.data)
    }

    /**
     * Defines the graph to which the MorphingGraph
     * should interpolate.
     **/
    public setTarget(graph:Graph) {
        this.targetGraph = graph
        this.targetDomain = graph.yScale.domain()
    }



    /**
     * Instead of adding marks as in a regular Graph
     * transitions from on mark to another
     * are defined on a MorphingGraph
     **/
    addTransition(from:string, to:string) {
        let mark = new MorphingMark(`${from}---${to}`)

        mark.from = this.originGraph.getMark(from)
        mark.to = this.targetGraph.getMark(to)

        this.marks.push(mark)
        return mark
    }

    draw() {
        this.drawMarks()
        this.unhide()
        let start = this.originGraph.yPosition()
        let end = this.targetGraph.yPosition()
        let interpolator = d3.interpolate(start, end)
        console.log(this.chart)
        this.chart
            .attr("transform", `translate(0, ${interpolator(this.howFar)})`)

    }

    
    /**
     * Defines at which stage between `from`-
     * and `to`-graphs the MorphingGraph should
     * be drawn. `howFar` should be a number between 0 and 1
     **/
    public atPoint(howFar:number) {
        if(0 > howFar || 1 < howFar) {throw new Error("howFar should be between 0 and 1")}
        this.howFar = howFar 
        return this
    }


    public hide() {
        this.chart
            .style("opacity", 0)
    }

    public unhide() {
        this.chart
            .style("opacity", 1)
    }


    public getPathFor(markName:string) {
        let from = this.fromToClasses(markName).from
        let to = this.fromToClasses(markName).to


        let path1 = this.originGraph.getPathFor(from)
        let path2 = this.targetGraph.getPathFor(to)

        return d3.interpolate(path1, path2)(this.howFar)
    }


    public getColorFor(mark:MorphingMark) {
        return mark.atPoint(this.howFar).color
    }

    protected axisLeft() {
        let originDomain = this.originGraph.yScale.domain()
        let targetDomain = this.targetGraph.yScale.domain()
        let interpolator = d3.interpolate(originDomain, targetDomain)

        let yScale = d3.scaleLinear()
            .domain(interpolator(this.howFar))
            .range(this.originGraph.yScale.range())


        return this.formatLeftAxis(d3.axisLeft(yScale).tickSize(-this.w+2*this.margin).tickPadding(10))
    }

    private fromToClasses(markName:string) {
        let pair = markName.split("---") 
        if(pair.length !== 2) {throw new Error("Need two properties to interpolate between")}
        return {from: pair[0], to: pair[1]}
    }
}


/**
 * Will paint the transition including the labels
 **/
export class MorphingGraphWithLabels extends MorphingGraph {

    draw() {
        this.drawMarks()
        this.drawLabels()
        this.unhide()
        let start = this.originGraph.yPosition()
        let end = this.targetGraph.yPosition()
        let interpolator = d3.interpolate(start, end)
        console.log(this.chart)
        this.chart
            .attr("transform", `translate(0, ${interpolator(this.howFar)})`)
    }
    
    public labelYPosition(mark:MorphingMark, offset=0) {
        let start = this.originGraph.labelYPosition(mark.from, offset)
        let end = this.targetGraph.labelYPosition(mark.to, offset)
        return d3.interpolate(start, end)(this.howFar)
    }
    
}

