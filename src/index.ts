import * as intro from './intro';
import * as decrease from './decrease';
import * as older from './older';
import * as uptick from './uptick';
import * as aids from './aids';
import interpolatePath from './interpolate-path';
import {Graph} from './Graph'
import * as d3 from 'd3';


let start = 200
let end = 400
let graphPromises = []
graphPromises.push(decrease.graph())
graphPromises.push(older.graph())
graphPromises.push(uptick.graph())
graphPromises.push(aids.graph())

Promise.all(graphPromises).then( (graphs) => {
    graphs[0].draw()
    graphs[1].draw()
    let ip = new Animator(graphs[0], graphs[1])
    ip.setInterpolations(
        m(`
MortalityEveryone -> popshare25
MortalityEveryone -> popshare25_44
MortalityEveryone -> popshare45_54
MortalityEveryone -> popshare55_64
MortalityEveryone -> popshare65_74
MortalityEveryone -> popshare75
        `)
    )
})


function m(str):string[][] {
   return str.trim().split(/\n/).map( el => el.trim().split(/->/).map(elem => elem.trim()))
}

class Animator {

    frm:Graph
    to:Graph
    interpolations:string[][]

    constructor(frm, to) {
        this.frm = frm
        this.to = to
        document.addEventListener("scroll", evt => this.scrolling(evt))
    }

    setInterpolations(map:string[][]) {
        this.interpolations = map
        //this.scrolling({pageY: 300})
    }

    scrolling(evt) {
        let offset = evt.pageY
        if (offset > start && offset < end) {
            this.transition(this.howFar(start, end, offset)) 
        }
    }

    howFar(start:number, end:number, offset:number) {
        let total = end-start
        let position = offset - start

        if(total < 0) {throw new Error("End is before start")}
        if(position < 0) {throw new Error("Position is not between end and start")}

        return position/total
    }

    transition(howFar:number) {
        this.interpolations.forEach( interpolation => {
            let path1 = this.frm.getPathFor(interpolation[0])
            let path2 = this.to.getPathFor(interpolation[1])
            this.draw(this.pathInterpolator(path1, path2, howFar))
        })

    }


    draw(path) {
        d3.select("#decrease svg .animated").remove()
        d3.select("#decrease svg")
            .append("path")
            .attr("class", "animated")
            .attr("d", path)
            .attr("stroke", "white")
            .attr("fill", "none")
    }


    pathInterpolator(path1, path2, offset) {
        let interpolator = interpolatePath(path1, path2, null)
        return interpolator(offset)
    }
}


class Interpolation {
    constructor() {}

    from(graph, attribute) {}
    to(graph, attribute) {}

    interpolatePath() {
    
    }

    interpolateColor() {
    }
}



