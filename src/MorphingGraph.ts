import * as d3 from 'd3';
import {Graph} from './Graph';
import {MorphingMark, Mark} from './Mark'



    /**
     * This chart needs no data but is based on two existing graphs. Example usage:
     * ```javascript
     * // g1 and g2 are Graphs
     * // a and b are the names of marks from g1 and g2 respectively
     * mg = new MorpingGraph("name")
     * mg.setOrigin(g1)
     * mg.setTarget(g2)
     * mg.addTransition("a", "b")
     * mg.atPoint(0.5).draw()
     * ```
    **/


export class MorphingGraph extends Graph {
    name:string
    originGraph:Graph
    originDomain:number[]

    targetGraph:Graph
    targetDomain:number[]


    howFar:number

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
     * transitions from one mark to another
     * are defined on a MorphingMark. The name of the MorphingMark
     * is a combination of the names of the marks it interpolates
     * between separated by "---"
     **/
    addTransition(from:string, to:string) {
        let mark = new MorphingMark(`${from}---${to}`)

        mark.from = this.originGraph.getMark(from)
        mark.to = this.targetGraph.getMark(to)

        this.marks.push(mark)
        return mark
    }

    draw() {
        this.drawAxes()
        this.drawMarks()
        this.unhide()
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


    /**
     * The interpolated path for the `MorphingMark` of a given name
     **/
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


    /**
     * Extracting the names of the original marks from the
     * name of a MorphingMark
     **/
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
        this.drawAxes() 
        this.drawMarks()
        this.drawLabels()
        this.unhide()
    }
    
    public labelYPosition(mark:MorphingMark, offset=0) {
        let start = this.originGraph.labelYPosition(mark.from, offset)
        let end = this.targetGraph.labelYPosition(mark.to, offset)
        return d3.interpolate(start, end)(this.howFar)
    }
    
}

