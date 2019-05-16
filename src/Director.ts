import * as d3 from 'd3'
import {Graph, Drawable} from './Graph'
import {MorphingGraph} from './MorphingGraph'
import {Logger} from './Logger'

export class Director {
    storyboard:Step[] = []
    timer:Date = new Date()
    logTimer:Date = new Date()
    lastScrollTop:number
    logger:Logger

    lastScroll:number = null

    constructor() {
        this.lastScrollTop = window.scrollY;
        this.logger = new Logger()

        if (window.requestAnimationFrame) {
            let that = this
            try {
                this.loop();
            } catch(e) {
                this.logger
            }
        }

        // Send log every 5 seconds
        setInterval(() => this.save(), 5 * 1000);
        setInterval(() => this.alive(), 20 * 1000)
    }

    save() {
        this.logger.send()
    }

    alive() {
        this.logger.alive()
        this.logger.send() 
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
        let logTimerDiff = t.getTime() - this.logTimer.getTime()


        // only execute if the last execution has been
        // been more than x ms ago
        if(difference<10) {return}

        this.timer = t
        this.drawAll(scroll)
    }

    drawAll(offset:number) {
        this.storyboard.forEach( (step) => {
            if (offset > step.start && offset <= step.end) {
                this.draw(step.graph, this.howFar(step, offset)) 
            } else {
                this.hide(step.graph) 
            }
        })
    }


    addStep(start:number, end:number, graph:Drawable) {
        this.storyboard.push(new Step(start, end, graph))
    }

    protected howFar(step:Step, offset:number):number {
        let total = step.end-step.start
        let position = offset - step.start

        if(total < 0) {throw new Error("End is before start")}
        if(position < 0) {throw new Error("Position is not between end and start")}

        return this.easing(position/total)
    }

    get storyLength() {
        let len =  this.storyboard[this.storyboard.length-1].start
        if (len < 0) {
            return 0
        } else {
            return len
        }
    }

    get absolutePosition() {
        return this.lastScrollTop / this.storyLength
    }

    /**
     * The easing-method wraps `howFar` to allow the application of
     * different easing functions.
     **/
    easing(howFar:number){
        return howFar 
    }


    draw(graph:Drawable, howFar:number) {
        this.logger.animation(graph.name, howFar, this.absolutePosition)
        if(graph instanceof MorphingGraph) {
            graph.atPoint(howFar).draw() 
        } else {
            graph.draw() 
        }
    }

    hide(graph:Drawable) {
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
    graph:Drawable

    constructor(f:number, t:number, g:Drawable) {
        this.start = f
        this.end = t
        this.graph = g
        return this
    }
}
