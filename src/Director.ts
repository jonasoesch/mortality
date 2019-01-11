import * as d3 from 'd3'
import {Graph} from './Graph'
import {MorphingGraph} from './MorphingGraph'

export class Director {
    name:string
    initial:Graph
    final:Graph
    actor:MorphingGraph
    stage:d3.Selection<any, any, any, any>
    start= 200
    end = 400

    constructor(name) {
        this.name = name 
    }

    protected setStage() {
        this.stage = this.initial.chart
    }

    setFromTo(initial:Graph, final:Graph) {
        this.initial = initial 
        this.final = final
        this.setStage()
        document.addEventListener('scroll', (evt) => this.scrolling(evt))
    }

    setActor(a:MorphingGraph) {
        this.actor  =a
    }

    scrolling(evt) {
        let offset = evt.pageY
        if (offset > this.start && offset < this.end) {
            this.transition(this.howFar(offset)) 
        }
    }

    protected howFar(offset) {
        let total = this.end-this.start
        let position = offset - this.start

        if(total < 0) {throw new Error("End is before start")}
        if(position < 0) {throw new Error("Position is not between end and start")}

        return position/total
    }


    transition(howFar:number) {
        this.actor.atPoint(howFar).draw() 
        //this.initial.fadeOut()
    }

    setAnimatedProperties(properties:string[][]) {
        let a =  new MorphingGraph("First") 
        a.setOrigin(this.initial)
        a.setTarget(this.final)
        properties.forEach( (pair:string[]) => {
            a.addTransition(pair[0], pair[1])
        }) 
        this.setActor(a)
    }
}
