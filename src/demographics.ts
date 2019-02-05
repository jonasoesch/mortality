import {genderGraph, demographicsGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {SkelettonDecorator} from './Graph'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()

    d.addStep(-200, 20, scrollIndicator)
    
    questionnaire(d, "absolute.html").draw() 
    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()

})
