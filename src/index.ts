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
    document.getElementsByTagName('body')[0].scrollBy(0, 2) // Initial drawing
    d.addStep(-10, 200, graphs[0])


    let decreaseHighlight = graphs[0].cloneWithNewName("decrease-everyone")
    decreaseHighlight.removeMark("MortalityFemales")
    decreaseHighlight.removeMark("MortalityMales")
    decreaseHighlight.setData(
        decreaseHighlight.data.map(d => { 
            return {
            date: d["date"],
            MortalityEveryone: 1000,
            }
        })
    )

    let decreaseDecrease = new MorphingGraphWithLabels("decrease-everyone-morph")
    decreaseDecrease.setOrigin(graphs[0])
    decreaseDecrease.setTarget(decreaseHighlight)
    decreaseDecrease.addTransition("MortalityEveryone", "MortalityEveryone").setLabel("Everyone")

    d.addStep(200, 400, decreaseDecrease)

    let decreaseOlder = new MorphingGraph("decrease-older")
    decreaseOlder.setOrigin(decreaseHighlight)//gender based
    decreaseOlder.setTarget(graphs[1])//demographics
    decreaseOlder.addTransition("MortalityEveryone", "popshare25")
    decreaseOlder.addTransition("MortalityEveryone", "popshare25_44")
    decreaseOlder.addTransition("MortalityEveryone", "popshare45_54")
    decreaseOlder.addTransition("MortalityEveryone", "popshare55_64")
    decreaseOlder.addTransition("MortalityEveryone", "popshare65_74")
    decreaseOlder.addTransition("MortalityEveryone", "popshare75")


    d.addStep(400, 600, decreaseOlder)

    d.addStep(600,700, graphs[1]) // demographics
    
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


    d.addStep(700,1000, olderDifferences) 
    d.addStep(1000, 1200, graphs[2]) // differences

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

    d.addStep(1200, 1600, differencesUptick)
    d.addStep(1600, 1800, graphs[3]) // uptick

    let highlightMiddleAge = graphs[3].cloneWithNewName("highlightMiddleAge")
    highlightMiddleAge.removeMark("Rate85up")
    highlightMiddleAge.removeMark("Rate75_84")
    highlightMiddleAge.removeMark("Rate65_74")
    highlightMiddleAge.removeMark("Rate55_64")
    highlightMiddleAge.removeMark("Rate45_54")
    highlightMiddleAge.removeMark("Rate_25")
    d.addStep(1800, 2000, highlightMiddleAge) 

    let uptickAids = new MorphingGraph("uptick-aids")
    uptickAids.setOrigin(highlightMiddleAge) // uptick
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

    d.addStep(2000, 2200, uptickAids)

    d.addStep(2200, 3000, graphs[4])

})
