import * as d3 from 'd3';
import {Graph} from './graph';
import interpolatePath from './interpolate-path';

export class Actor {
    name:string
    originGraph:Graph
    originProperty:string

    targetGraph:Graph
    targetProperty:string

    stage:d3.Selection<any, any, any, any>
        _pathInterpolator:Function

    constructor(name) {
        this.name = name 
    }

    public setOrigin(graph:Graph, property:string) {
        this.originGraph = graph     
        this.originProperty = property
    }


    public setTarget(graph:Graph, property:string) {
        this.targetGraph = graph
        this.targetProperty = property
    }


    public setStage(svg:d3.Selection<any, any, any, any>) {
        this.stage = svg 
    }


    public draw(howFar:number) {
        this.stage.select(`.${this.name}`).remove()
        this.stage
            .append("g")
            .attr("class", this.name)
            .append("path")
            .attr("d", this.path(howFar))
            .attr("fill", this.color(howFar)) 
    }


    protected pathInterpolator() {
        if(this._pathInterpolator == null) {
            let path1 = this.originGraph.getPathFor(this.originProperty)
            let path2 = this.targetGraph.getPathFor(this.targetProperty)
            console.log(path1 == path2)
            this._pathInterpolator = interpolatePath(path1, path2, null)
        }
        return  this._pathInterpolator
    }

    protected colorInterpolator() {
        let color1 = this.originGraph.getColorFor(this.originProperty)
        let color2 = this.targetGraph.getColorFor(this.targetProperty)
        return d3.interpolateHsl(color1, color2) 
    }

    protected path(howFar:number) {
        return this.pathInterpolator()(howFar)
    }

    protected color(howFar:number) {
        return this.colorInterpolator()(howFar)
    }

}


export class AxisActor extends Actor {
    draw(howFar:number) {
        this.originGraph.setScales(
            this.originGraph.xScale.domain(),
            this.axis(howFar)
        )
        this.originGraph.draw()
    }


     public setOrigin(graph:Graph, property:string="origin axis") {
        this.originGraph = graph     
        this.originProperty = property
    }


    public setTarget(graph:Graph, property:string="target axis") {
        this.targetGraph = graph
        this.targetProperty = property
    }


    protected axis(howFar:number):[number, number] {
        return (this.axisInterpolator()(howFar) as [number, number])
    }

    protected axisInterpolator() {
        let domain0 = this.originGraph.yScale.domain()
        let domain1 = this.targetGraph.yScale.domain()
        return d3.interpolate(domain0, domain1);
    }
}
