import * as d3 from "d3";
import * as glob from "./globals.json"
import {Graph} from './Graph'


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
