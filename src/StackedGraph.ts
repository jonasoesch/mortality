import * as d3 from "d3";
import * as glob from "./globals.json"
import {Graph} from './Graph'
import {Mark} from './Mark'


export class StackedGraph extends Graph {
    stacks:any;
    dates:Date[];


    setData(data:any[]) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
        this.pathGenerators()
        this.stacks = (d3.stack()
            .keys(this.marks.map(k => k.name)))(<any>data)
        this.dates = data.map( d => (d.date as Date))
    }


    pathGenerators() {
        this.marks.forEach( mark => {
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
         this.marks.forEach( (mark) => {
             this.drawPath(paths, mark.name)    
         })

    }

    drawPath(container:d3.Selection<any, any, any, any>, markName:string) {
            container.append('path')
                .attr("d", d => this.getPathFor(markName))
                .attr("fill", this.getColorFor(markName))
    }


    getPathFor(markName:string) {
        if(this.stacks == null) {throw new Error("There is no data yet")}
        if(this.paths.length === 0) {throw new Error("No pathGenerators yet")}


        let i = this.marks.map( k => k.name ).indexOf(markName)
        if(i === -1) {throw new Error(`There is no mark with name ${markName} in ${this.name}`)}
        let ret = this.paths[i](this.stacks[i])
        return ret
    }


    removeFill() {}
    
    labelYPosition(d:any, markName:string, i:number, offset:number) {
        return this.yScale(this.stacks[i][this.stacks[i].length-1][1] || 1) 
            + 20
            + offset 
            + this.getMark(markName).labelOffsets[1]
    }
}



