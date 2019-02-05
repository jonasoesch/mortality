import {genderGraph, demographicsGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()


    // Storyboard
    d.addStep(-200, 50, graphs[0]) // gender
    d.addStep(-200, 20, scrollIndicator)
    d.addStep(50, 10000, graphs[1]) // demographics

    d.drawAll(0)

    questionnaire(d, "absolute.html").draw() 

})
