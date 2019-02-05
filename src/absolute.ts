import {demographicsGraph, ageDifferencesGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'


Promise.all([demographicsGraph(), ageDifferencesGraph()]).then( graphs => {
    const d = new Director()

    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 10000, graphs[1])

    d.drawAll(0)

    questionnaire(d, "relative.html").draw() 
})
