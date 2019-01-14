import * as intro from './intro';
import * as decrease from './decrease';
import * as older from './older';
import * as uptick from './uptick';
import * as aids from './aids';
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'


let graphPromises = []
graphPromises.push(decrease.graph())
graphPromises.push(older.graph())
graphPromises.push(uptick.graph())
graphPromises.push(aids.graph())

Promise.all(graphPromises).then( (graphs) => {
    let d = new Director()
    graphs[0].draw()
    d.addStep(-10, 200, graphs[0])

    let decreaseOlder = new MorphingGraph("decrease-older")
    decreaseOlder.setOrigin(graphs[0])
    decreaseOlder.setTarget(graphs[1])
    decreaseOlder.addTransition("MortalityEveryone", "popshare25")
    decreaseOlder.addTransition("MortalityEveryone", "popshare25_44")
    decreaseOlder.addTransition("MortalityEveryone", "popshare45_54")
    decreaseOlder.addTransition("MortalityEveryone", "popshare55_64")
    decreaseOlder.addTransition("MortalityEveryone", "popshare65_74")
    decreaseOlder.addTransition("MortalityEveryone", "popshare75")


    d.addStep(200, 600, decreaseOlder)

    d.addStep(600,700, graphs[1])


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

    d.addStep(700, 1100, olderUptick)


    d.addStep(1100, 1300, graphs[2])

    let uptickAids = new MorphingGraph("uptick-aids")
    uptickAids.setOrigin(graphs[2])
    uptickAids.setTarget(graphs[3])
    uptickAids.addTransition("Rate25_44", "Other")
    uptickAids.addTransition("Rate25_44", "Cancer")
    uptickAids.addTransition("Rate25_44", "Heart")
    uptickAids.addTransition("Rate25_44", "LiverKidneyPancreas")
    uptickAids.addTransition("Rate25_44", "Suicide")
    uptickAids.addTransition("Rate25_44", "Vehicle")
    uptickAids.addTransition("Rate25_44", "Homicide")
    uptickAids.addTransition("Rate25_44", "Respiratory")
    uptickAids.addTransition("Rate25_44", "Drug_induced")
    uptickAids.addTransition("Rate25_44", "AIDS")


    d.addStep(1300, 1700, uptickAids)

    d.addStep(1700, 3000, graphs[3])

})

function m(str:string):string[][] {
   return str.trim().split(/\n/).map( el => el.trim().split(/->/).map(elem => elem.trim()))
}
