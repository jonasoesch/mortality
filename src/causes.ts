import {uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()

    const morph = new MorphingGraph("uptick-aids")
    morph.setOrigin(graphs[0]) // uptick
    morph.setTarget(graphs[1]) // aids
    morph.addTransition("Rate25_44", "Other")
    morph.addTransition("Rate25_44", "Cancer")
    morph.addTransition("Rate25_44", "Heart")
    morph.addTransition("Rate25_44", "LiverKidneyPancreas")
    morph.addTransition("Rate25_44", "Suicide")
    morph.addTransition("Rate25_44", "Vehicle")
    morph.addTransition("Rate25_44", "Homicide")
    morph.addTransition("Rate25_44", "Respiratory")
    morph.addTransition("Rate25_44", "Drug_induced")
    morph.addTransition("Rate25_44", "AIDS")


    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(200, 500, morph)
    d.addStep(500, 10000, graphs[1])

    graphs[0].draw()
    graphs[1].draw()
})
