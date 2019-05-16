import * as d3 from "d3";
import * as glob from "./globals.json"
import {Graph} from './Graph'
import {Mark} from './Mark'


export class StackedGraph extends Graph {

    /**
     * To create a stacked graph, the data needs to be transformed.
     * The transformed data is stored in `stacks`.
     **/
    stacks:any;


    public setData(data:any[]) {
        if(data === null) {throw new Error("You passed no data")}
        this.data = data
        this.stacks = (d3.stack()
            .keys(this.marks.map(mark => mark.name)))(<any>data)
    }

    protected pathGeneratorFor(markName:string) {
        return d3.area()
                .x( d => this.xScale((d as any)["data"]["date"]))
                .y1(d => this.yScale(d[1] || 1))
                .y0(d => this.yScale(d[0]))
    }
    
    public getPathFor(markName:string):string {
        let mark = this.getMark(markName)

        if(mark === undefined) {throw new Error(`There is no mark named ${markName}`)}
        if(this.stacks == null) {throw new Error("There is no data yet")}
        if(mark.pathGenerator === null) {throw new Error(`No pathGenerator mark ${markName}`)}

        let path = mark.pathGenerator(this.stackDataFor(mark))
       
        if(!path) {
            throw new TypeError("The path that would be genereated is null") 
        } else {
            return path
        }
    }


    /**
     * Redefined from Graph
     **/
    public labelYPosition( mark:Mark, offset:number) {
        let stackData = this.stackDataFor(mark)
        let i = this.marks.map(m => m.name).indexOf(mark.name)
        return this.yScale(stackData[stackData.length-1][1] || 1) 
            + 20
            + this.rescale(offset)
            + this.rescale( mark.labelOffsets[1] ) 
    }

    /**
     * Returns the corresponding array of data
     * in stacks for a given mark
     **/
    private stackDataFor(mark:Mark) {
        let i = this.marks.map( m => m.name ).indexOf(mark.name)
        return this.stacks[i]
    }
}
