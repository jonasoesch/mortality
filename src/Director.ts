import * as d3 from 'd3'
import {Graph} from './Graph'
import {MorphingGraph} from './MorphingGraph'

export class Director {
    storyboard:Step[] = []
    timer:Date = new Date()
    lastScrollTop:number

    constructor() {
       this.lastScrollTop = window.scrollY;
        
        if (window.requestAnimationFrame) {
            let that = this
            this.loop();
        }
    }


    loop() {
        var scrollTop = window.scrollY;
        if (this.lastScrollTop === scrollTop) {
            window.requestAnimationFrame(() => this.loop());
            return;
        } else {
            this.lastScrollTop = scrollTop;

            // fire scroll function if scrolls vertically
            this.scrolling(scrollTop);
            window.requestAnimationFrame(() => this.loop());
        }
    } 

    scrolling(scroll:number) {

        let t = new Date()
        let difference = t.getTime() - this.timer.getTime()

        // only execute if the last execution has been
        // been more than x ms ago
        if(difference<10) {return}
        
        this.timer = t

        let offset = scroll
        this.storyboard.forEach( (step) => {
            if (offset > step.start && offset <= step.end) {
                this.draw(step.graph, this.howFar(step, offset)) 
            } else {
                this.hide(step.graph) 
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
        } else {
            graph.draw() 
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
