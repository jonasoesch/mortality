import * as d3 from 'd3';
import {Graph} from './graph';
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

    constructor(name) {
        super(name)
        this.name = name 
    }

    public setOrigin(graph:Graph) {
        this.originGraph = graph     
        this.originDomain = graph.yScale.domain()

        // Initialize everything with the origin graph
        this.setScales(graph.xScale.domain(), (graph.yScale.domain() as [number, number]))
        this.setColors(graph.colors)
        this.setLabels(graph.labels)
        this.setLabelOffsets(graph.labelOffsets)
        this.setData(graph.data)
    }


    setClasses() {}
    drawLabels() {}


    public setTarget(graph:Graph) {
        this.targetGraph = graph
        this.targetDomain = graph.yScale.domain()
    }


    addTransition(from, to) {
        this.classes.push(`${from}---${to}`)
        console.log(this.classes)
    }


    public atPoint(howFar:number) {
        this.howFar = howFar 
        return this
    }


    getPathFor(klass) {
        let from = this.fromToClasses(klass).from
        let to = this.fromToClasses(klass).to


        let path1 = this.originGraph.getPathFor(from)
        let path2 = this.targetGraph.getPathFor(to)

        return interpolatePath(path1, path2, null)(this.howFar)
    }


    getColorFor(klass) {
        let from = this.fromToClasses(klass).from
        let to = this.fromToClasses(klass).to


        let color1 = this.originGraph.getColorFor(from)
        let color2 = this.targetGraph.getColorFor(to)
        console.log(color1, color2)
        return d3.interpolateHsl(color1, color2)(this.howFar)
    }

    private fromToClasses(klass) {
        let pair = klass.split("---") 
        if(pair.length !== 2) {throw new Error("Need two properties to interpolate between")}
        return {from: pair[0], to: pair[1]}
    }


    protected axis(howFar:number):[number, number] {
        return (this.axisInterpolator()(howFar) as [number, number])
    }

    protected axisInterpolator() {
        return d3.interpolate(this.originDomain, this.targetDomain);
    }

}


