import {uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()

    const highlightMiddleAge = graphs[0].cloneWithNewName("highlight")
    highlightMiddleAge.removeMark("Rate85up")
    highlightMiddleAge.removeMark("Rate75_84")
    highlightMiddleAge.removeMark("Rate65_74")
    highlightMiddleAge.removeMark("Rate55_64")
    highlightMiddleAge.removeMark("Rate45_54")
    highlightMiddleAge.removeMark("Rate_25")
    d.addStep(1800, 2000, highlightMiddleAge) 



    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 10000, graphs[1])

    d.drawAll(0)
})
