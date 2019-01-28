import {ageDifferencesGraph, uptickGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    const d = new Director()


    let morph = new MorphingGraphWithLabels("differences-uptick")
    morph.setOrigin(graphs[0]) // differences
    morph.setTarget(graphs[1]) // uptick
    morph.addTransition("Rate_25"  , "Rate_25"  ).setLabel("Under 25")
    morph.addTransition("Rate25_44", "Rate25_44").setLabel("25–44")
    morph.addTransition("Rate45_54", "Rate45_54").setLabel("45–54")
    morph.addTransition("Rate55_64", "Rate55_64").setLabel("55–64")
    morph.addTransition("Rate65_74", "Rate65_74").setLabel("65-74")
    morph.addTransition("Rate75_84", "Rate75_84").setLabel("75–84")
    morph.addTransition("Rate85up" , "Rate85up" ).setLabel("Over 84")

    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 500, morph)
    d.addStep(500, 10000, graphs[1])

    graphs[0].draw()
    scrollIndicator.draw()
    graphs[1].draw()
})
