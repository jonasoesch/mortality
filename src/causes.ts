import {uptickGraph, aidsGraph, questionnaire} from './graphs'
import {SkelettonDecorator} from './Graph'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()

    d.addStep(-200, 40, scrollIndicator)

    questionnaire(d, "demographics.html").draw() 

    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()
})
