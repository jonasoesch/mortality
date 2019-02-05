import {ageDifferencesGraph, uptickGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {SkelettonDecorator} from './Graph'
import {MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    const d = new Director()

    d.addStep(-200, 40, scrollIndicator)

    questionnaire(d, "causes.html").draw() 
    
    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()
})
