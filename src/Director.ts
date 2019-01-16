import * as d3 from 'd3'
import {Graph} from './Graph'
import {MorphingGraph} from './MorphingGraph'

export class Director {
    storyboard:Step[] = []

    constructor() {
        document.addEventListener('scroll', (evt) => this.scrolling(evt))
    }

    scrolling(evt:any) {
        let offset = evt.pageY
        this.storyboard.forEach( (step) => {
            if (offset > step.start && offset < step.end) {
                this.draw(step.graph, this.howFar(step, offset)) 
            } else {
                if(step.graph instanceof MorphingGraph) {
                    this.hide(step.graph)
                }
            }
        })
    }


    addStep(start:number, end:number, graph:Graph) {
        this.storyboard.push(new Step(start, end, graph))
    }

    protected howFar(step:Step, offset:number) {
        let total = step.end-step.start
        let position = offset - step.start

        if(total < 0) {throw new Error("End is before start")}
        if(position < 0) {throw new Error("Position is not between end and start")}

        return position/total
    }


    draw(graph:Graph, howFar:number) {
        if(graph instanceof MorphingGraph) {
            graph.atPoint(howFar).draw() 
        } 
    }

    hide(graph:Graph) {
        graph.hide() 
    }


    toString():string {
        let out = ""
        this.storyboard.forEach(step => {
            out = out + step.start + "–"
            out = out + step.end + ": "
            out = out + step.graph.name + "\n"
        })
        return out
    }

}


class Step {
    start:number
    end:number
    graph:Graph

    constructor(f:number, t:number, g:Graph) {
        this.start = f
        this.end = t
        this.graph = g
        return this
    }
}
