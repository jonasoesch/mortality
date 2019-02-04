import {genderGraph, demographicsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()


    let form = new Form("survey")
    form.addQuestion("1. In your opinion, what efffect or relationship is shown in the data mini-story?")
    form.addQuestion("2. Which group did you pay the most attention to in this data mini-story?")
    form.setNextPage("absolute.html")
    form.setLogger(d.logger)
    form.draw()
    
    // Storyboard
    d.addStep(-200, 50, graphs[0]) // gender
    d.addStep(-200, 20, scrollIndicator)
    d.addStep(50, 10000, graphs[1]) // demographics

    d.drawAll(0)
})
