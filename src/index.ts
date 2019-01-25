import {genderGraph, demographicsGraph, ageDifferencesGraph, uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {Graph} from './Graph'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'


let graphPromises = []
graphPromises.push(genderGraph())
graphPromises.push(demographicsGraph())
graphPromises.push(ageDifferencesGraph())
graphPromises.push(uptickGraph())
graphPromises.push(aidsGraph())

Promise.all(graphPromises).then( (graphs) => {
    let d = new Director()
    graphs[0].draw()
    graphs[1].draw()
    graphs[2].draw()
    graphs[3].draw()
    graphs[4].draw()


    let decreaseOlder = new MorphingGraph("decrease-older")
    decreaseOlder.setOrigin(graphs[0])//decrease
    decreaseOlder.setTarget(graphs[1])//older
    decreaseOlder.addTransition("MortalityEveryone", "popshare25")
    decreaseOlder.addTransition("MortalityEveryone", "popshare25_44")
    decreaseOlder.addTransition("MortalityEveryone", "popshare45_54")
    decreaseOlder.addTransition("MortalityEveryone", "popshare55_64")
    decreaseOlder.addTransition("MortalityEveryone", "popshare65_74")
    decreaseOlder.addTransition("MortalityEveryone", "popshare75")


    d.addStep(decreaseOlder.originGraph.yPosition()+50, decreaseOlder.targetGraph.yPosition()-200, decreaseOlder)

    let olderDifferences = new MorphingGraph("older-differences")
    olderDifferences.setOrigin(graphs[1]) // demographics
    olderDifferences.setTarget(graphs[2]) // differences
    olderDifferences.addTransition("popshare25", "Rate_25")
    olderDifferences.addTransition("popshare25_44", "Rate25_44")
    olderDifferences.addTransition("popshare45_54", "Rate45_54")
    olderDifferences.addTransition("popshare55_64", "Rate55_64")
    olderDifferences.addTransition("popshare65_74", "Rate65_74")
    olderDifferences.addTransition("popshare75", "Rate75_84")
    olderDifferences.addTransition("popshare75", "Rate85up")


    d.addStep(olderDifferences.originGraph.yPosition()+50, olderDifferences.targetGraph.yPosition()-200, olderDifferences) 

    let differencesUptick = new MorphingGraphWithLabels("differences-uptick")
    differencesUptick.setOrigin(graphs[2]) // differences
    differencesUptick.setTarget(graphs[3]) // uptick
    differencesUptick.addTransition("Rate_25"  , "Rate_25"  ).setLabel("Under 25")
    differencesUptick.addTransition("Rate25_44", "Rate25_44").setLabel("25–44")
    differencesUptick.addTransition("Rate45_54", "Rate45_54").setLabel("45–54")
    differencesUptick.addTransition("Rate55_64", "Rate55_64").setLabel("55–64")
    differencesUptick.addTransition("Rate65_74", "Rate65_74").setLabel("65-74")
    differencesUptick.addTransition("Rate75_84", "Rate75_84").setLabel("75–84")
    differencesUptick.addTransition("Rate85up" , "Rate85up" ).setLabel("Over 84")

    d.addStep(differencesUptick.originGraph.yPosition()+50, differencesUptick.targetGraph.yPosition()-200, differencesUptick)


    let uptickAids = new MorphingGraph("uptick-aids")
    uptickAids.setOrigin(graphs[3]) // uptick
    uptickAids.setTarget(graphs[4]) // aids
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

    d.addStep(uptickAids.originGraph.yPosition()+50, uptickAids.targetGraph.yPosition()-200, uptickAids)

})
