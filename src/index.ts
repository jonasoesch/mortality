import * as intro from './intro';
import * as decrease from './decrease';
import * as older from './older';
import * as uptick from './uptick';
import * as aids from './aids';
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'


let start = 200
let end = 400
let graphPromises = []
graphPromises.push(decrease.graph())
graphPromises.push(older.graph())
graphPromises.push(uptick.graph())
graphPromises.push(aids.graph())

Promise.all(graphPromises).then( (graphs) => {
    let d = new Director()
    d.addStep(0, 200, graphs[0])

    let decreaseOlder = new MorphingGraph("decrease-older")
    decreaseOlder.setOrigin(graphs[0])
    decreaseOlder.setTarget(graphs[1])
    decreaseOlder.addTransition("MortalityEveryone", "popshare25")
    decreaseOlder.addTransition("MortalityEveryone", "popshare25_44")
    decreaseOlder.addTransition("MortalityEveryone", "popshare45_54")
    decreaseOlder.addTransition("MortalityEveryone", "popshare55_64")
    decreaseOlder.addTransition("MortalityEveryone", "popshare65_74")
    decreaseOlder.addTransition("MortalityEveryone", "popshare75")


    d.addStep(200, 400, decreaseOlder)

    d.addStep(400,600, graphs[1])


    let olderUptick = new MorphingGraph("older-uptick")
    olderUptick.setOrigin(graphs[1])
    olderUptick.setTarget(graphs[2])
    olderUptick.addTransition("popshare25", "Rate_25")
    olderUptick.addTransition("popshare25_44", "Rate25_44")
    olderUptick.addTransition("popshare45_54", "Rate45_54")
    olderUptick.addTransition("popshare55_64", "Rate55_64")
    olderUptick.addTransition("popshare65_74", "Rate65_74")
    olderUptick.addTransition("popshare75", "Rate75_84")
    olderUptick.addTransition("popshare75", "Rate85up")

    d.addStep(600, 800, olderUptick)


    d.addStep(800, 1000, graphs[2])
})

function m(str:string):string[][] {
   return str.trim().split(/\n/).map( el => el.trim().split(/->/).map(elem => elem.trim()))
}
