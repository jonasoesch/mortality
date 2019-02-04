import {genderGraph, demographicsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()

    d.addStep(-200, 20, scrollIndicator)

    let form = new Form("survey")
    form.addQuestion("1. In your opinion, what efffect or relationship is shown in the data mini-story?")
    form.addQuestion("2. Which group did you pay the most attention to in this data mini-story?")
    form.setNextPage("absolute.html")
    form.setLogger(d.logger)
    form.draw()
    
    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()
})
