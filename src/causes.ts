import {uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()

    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 10000, graphs[1])
    

    let form = new Form("survey")
    form.addQuestion("1. In your opinion, what efffect or relationship is shown in the data mini-story?")
    form.addQuestion("2. Which group did you pay the most attention to in this data mini-story?")
    form.setNextPage("demographics.html")
    form.setLogger(d.logger)
    form.draw()

    d.drawAll(0)
})
