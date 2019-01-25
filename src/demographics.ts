import {genderGraph, demographicsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()
    graphs[0].draw()

    let morph = new MorphingGraph('gender-demographics')
    morph.setOrigin(graphs[0])
    morph.setTarget(graphs[1])
    morph.addTransition("MortalityEveryone", "popshare25")
    morph.addTransition("MortalityEveryone", "popshare25_44")
    morph.addTransition("MortalityEveryone", "popshare45_54")
    morph.addTransition("MortalityEveryone", "popshare55_64")
    morph.addTransition("MortalityEveryone", "popshare65_74")
    morph.addTransition("MortalityEveryone", "popshare75")

    // Storyboard
    d.addStep(-200, 200, graphs[0]) // gender
    d.addStep(200, 600, morph) // gender
    d.addStep(600, 10000, graphs[1]) // demographics
})
