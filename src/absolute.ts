import {demographicsGraph, ageDifferencesGraph, questionnaire} from './graphs'
import {SkelettonDecorator} from './Graph'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'


Promise.all([demographicsGraph(), ageDifferencesGraph()]).then( graphs => {
    const d = new Director()

     questionnaire(d, "relative.html").draw() 

    d.addStep(-200, 40, scrollIndicator)

    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()
})
