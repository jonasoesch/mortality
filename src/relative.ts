import {ageDifferencesGraph, uptickGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    const d = new Director()


    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 10000, graphs[1])


    questionnaire(d, "causes.html").draw() 

    d.drawAll(0)
})
