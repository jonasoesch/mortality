import * as d3 from 'd3'
import {Graph} from './Graph'
import {Actor} from './Actor'

export class Director {
    name:string
    initial:Graph
    final:Graph
    actors:Actor[] = []
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

    addActor(a:Actor) {
        this.actors.push(a) 
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
        this.actors.forEach( (actor) => {
            actor.draw(howFar) 
        }) 
    }

    setAnimatedProperties(properties:string[][]) {
        properties.forEach( (pair:string[]) => {
            this.actors.push(this.actor(pair[0], pair[1]))
        }) 
    }

    protected actor(from:string, to:string) {
        let a = new Actor(`${from}-${to}`) 
        a.setOrigin(this.initial, from)
        a.setTarget(this.final, to)
        a.setStage(this.stage)
        return a
    }

}
