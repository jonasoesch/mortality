import * as intro from './intro';
import * as decrease from './decrease';
import * as older from './older';
import * as uptick from './uptick';
import * as aids from './aids';
import {Director} from './Director'


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
    graphs[2].draw()
    graphs[3].draw()

    let d = new Director("Ferdinand")
    d.setFromTo(graphs[0], graphs[1])
    d.setAnimatedProperties(
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

function m(str:string):string[][] {
   return str.trim().split(/\n/).map( el => el.trim().split(/->/).map(elem => elem.trim()))
}
