import * as d3 from 'd3';
import {Graph} from './Graph';
import {Property} from './Property'
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
        this.classes = []
        this.name = name 
    }

    public setOrigin(graph:Graph) {
        this.originGraph = graph     
        this.originDomain = graph.yScale.domain()

        // Initialize everything with the origin graph
        this.setScales(graph.xScale.domain(), (graph.yScale.domain() as [number, number]))
        this.setData(graph.data)
    }


    setClasses() {}
    drawLabels() {}


    public setTarget(graph:Graph) {
        this.targetGraph = graph
        this.targetDomain = graph.yScale.domain()
    }


    addTransition(from:string, to:string) {
        let prop = new Property(`${from}---${to}`)
        prop.from = from
        prop.to = to
        this.classes.push(prop)
    }


    public atPoint(howFar:number) {
        this.howFar = howFar 
        return this
    }


    getPathFor(klass:string) {
        let from = this.fromToClasses(klass).from
        let to = this.fromToClasses(klass).to


        let path1 = this.originGraph.getPathFor(from)
        let path2 = this.targetGraph.getPathFor(to)

        return interpolatePath(path1, path2, null)(this.howFar)
    }


    getColorFor(klass:string) {
        let from = this.fromToClasses(klass).from
        let to = this.fromToClasses(klass).to


        let color1 = this.originGraph.getColorFor(from)
        let color2 = this.targetGraph.getColorFor(to)
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

    private fromToClasses(klass:string) {
        let pair = klass.split("---") 
        if(pair.length !== 2) {throw new Error("Need two properties to interpolate between")}
        return {from: pair[0], to: pair[1]}
    }

}


