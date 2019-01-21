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
     * No labels should be drawn
     **/
    drawLabels() {}


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


        return this.formatLeftAxis(d3.axisLeft(yScale).tickSize(-this.w).tickPadding(10))
    }

    private fromToClasses(markName:string) {
        let pair = markName.split("---") 
        if(pair.length !== 2) {throw new Error("Need two properties to interpolate between")}
        return {from: pair[0], to: pair[1]}
    }
)
}

export class MorphingGraphWithLabels extends MorphingGraph {
   drawLabels() {
        let labels = this.clearStagePart("labels")

        this.marks.forEach( (mark, i) => {
            debugger;
            labels.append("rect")
                .datum(this.data)
                .attr("y", d => this.labelYPosition(d, mark, -15))
                .attr("x", this.labelXPosition(mark))
                .attr("width", this.labelXWidth(mark))
                .attr("height", 20)
                .attr("fill", this.marks[i].color)
                .style("font-family", this.font)


            labels.append("text")
                .datum(this.data)
                .text(this.marks[i].label)
                .attr("y", d =>  this.labelYPosition(d, mark, 0))
                .attr("x", this.labelXPosition(mark))
                .attr("fill", this.fontColor)
                .style("font-family", this.font)
                .style("font-weight", "bold")
        } )
   } 

    public labelYPosition(d, mark, offset=0){
        return d3.interpolate(240, 147)(this.howFar) + offset 
    }
}
