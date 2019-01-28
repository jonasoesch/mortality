import {demographicsGraph, ageDifferencesGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'


Promise.all([demographicsGraph(), ageDifferencesGraph()]).then( graphs => {
    const d = new Director()

    let morph = new MorphingGraph("demographics-differences")
    morph.setOrigin(graphs[0]) // demographics
    morph.setTarget(graphs[1]) // differences
    morph.addTransition("popshare25", "Rate_25")
    morph.addTransition("popshare25_44", "Rate25_44")
    morph.addTransition("popshare45_54", "Rate45_54")
    morph.addTransition("popshare55_64", "Rate55_64")
    morph.addTransition("popshare65_74", "Rate65_74")
    morph.addTransition("popshare75", "Rate75_84")
    morph.addTransition("popshare75", "Rate85up")

    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 500, morph)
    d.addStep(500, 10000, graphs[1])


    graphs[0].draw()
    graphs[1].draw()
})
