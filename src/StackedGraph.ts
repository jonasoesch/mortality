import * as d3 from "d3";
import * as glob from "./globals.json"
import {Graph} from './Graph'
import {Property} from './Property'


export class StackedGraph extends Graph {
    stacks:any;
    dates:Date[];


    setData(data:any[]) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
        this.pathGenerators()
        this.stacks = (d3.stack()
            .keys(this.classes.map(k => k.name)))(<any>data)
        this.dates = data.map( d => (d.date as Date))
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
             this.drawPath(paths, klass.name)    
         })

    }

    drawPath(container:d3.Selection<any, any, any, any>, klass:string) {
            container.append('path')
                .attr("d", d => this.getPathFor(klass))
                .attr("fill", this.getColorFor(klass))
    }


    getPathFor(klass:string) {
        if(this.stacks == null) {throw new Error("There is no data yet")}
        if(this.paths.length === 0) {throw new Error("No pathGenerators yet")}


        let i = this.classes.map( k => k.name ).indexOf(klass)
        if(i === -1) {throw new Error(`There is no class with name ${klass} in ${this.name}`)}
        let ret = this.paths[i](this.stacks[i])
        return ret
    }


    setClasses(classes:string[]) {
        if(this.classes.length === classes.length) {
            classes.forEach( (c, i) => {
                this.classes[i].name = c
            } )
        } else {
            classes.forEach( (c) => {
                this.classes.push(new Property(c)) 
            } )
        }

    }


    removeFill() {}
    
    labelYPosition(d:any, klass:string, i:number, offset:number) {
        return this.yScale(this.stacks[i][this.stacks[i].length-1][1] || 1) 
            + 20
            + offset 
            + this.getPropertyFor(klass).labelOffsets[1]
    }
}



