import {decreaseGraph, decreaseEveryoneGraph, olderGraph, ageDifferencesGraph, uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'


let graphPromises = []
graphPromises.push(decreaseGraph())
graphPromises.push(decreaseEveryoneGraph())
graphPromises.push(olderGraph())
graphPromises.push(ageDifferencesGraph())
graphPromises.push(uptickGraph())
graphPromises.push(aidsGraph())

Promise.all(graphPromises).then( (graphs) => {
    let d = new Director()
    graphs[0].draw() // Initial drawing
    d.addStep(-10, 200, graphs[0])

    let decreaseDecrease = new MorphingGraphWithLabels("decrease-everyone-morph")
    decreaseDecrease.setOrigin(graphs[0])
    decreaseDecrease.setTarget(graphs[1])
    decreaseDecrease.addTransition("MortalityEveryone", "MortalityEveryone").setLabel("Everyone")

    d.addStep(200, 400, decreaseDecrease)

    let decreaseOlder = new MorphingGraph("decrease-older")
    decreaseOlder.setOrigin(graphs[1])//decrease
    decreaseOlder.setTarget(graphs[2])//older
    decreaseOlder.addTransition("MortalityEveryone", "popshare25")
    decreaseOlder.addTransition("MortalityEveryone", "popshare25_44")
    decreaseOlder.addTransition("MortalityEveryone", "popshare45_54")
    decreaseOlder.addTransition("MortalityEveryone", "popshare55_64")
    decreaseOlder.addTransition("MortalityEveryone", "popshare65_74")
    decreaseOlder.addTransition("MortalityEveryone", "popshare75")


    d.addStep(400, 600, decreaseOlder)

    d.addStep(600,700, graphs[2]) // older
    
    let olderDifferences = new MorphingGraph("older-differences")
    olderDifferences.setOrigin(graphs[2]) // older
    olderDifferences.setTarget(graphs[3]) // differences
    olderDifferences.addTransition("popshare25", "Rate_25")
    olderDifferences.addTransition("popshare25_44", "Rate25_44")
    olderDifferences.addTransition("popshare45_54", "Rate45_54")
    olderDifferences.addTransition("popshare55_64", "Rate55_64")
    olderDifferences.addTransition("popshare65_74", "Rate65_74")
    olderDifferences.addTransition("popshare75", "Rate75_84")
    olderDifferences.addTransition("popshare75", "Rate85up")


    d.addStep(700,1000, olderDifferences) 
    d.addStep(1000, 1200, graphs[3]) // differences

    let differencesUptick = new MorphingGraph("differences-uptick")
    differencesUptick.setOrigin(graphs[3]) // differences
    differencesUptick.setTarget(graphs[4]) // uptick
    differencesUptick.addTransition("Rate_25"  , "Rate_25"  )
    differencesUptick.addTransition("Rate25_44", "Rate25_44")
    differencesUptick.addTransition("Rate45_54", "Rate45_54")
    differencesUptick.addTransition("Rate55_64", "Rate55_64")
    differencesUptick.addTransition("Rate65_74", "Rate65_74")
    differencesUptick.addTransition("Rate75_84", "Rate75_84")
    differencesUptick.addTransition("Rate85up" , "Rate85up" )

    d.addStep(1200, 1600, differencesUptick)
    d.addStep(1600, 1800, graphs[4]) // uptick

    let uptickAids = new MorphingGraph("uptick-aids")
    uptickAids.setOrigin(graphs[4]) // uptick
    uptickAids.setTarget(graphs[5]) // aids
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

    d.addStep(1800, 2200, uptickAids)

    d.addStep(2200, 3000, graphs[5])

})

function m(str:string):string[][] {
   return str.trim().split(/\n/).map( el => el.trim().split(/->/).map(elem => elem.trim()))
}
