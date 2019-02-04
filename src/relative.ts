import {ageDifferencesGraph, uptickGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    const d = new Director()


    d.addStep(-200, 40, scrollIndicator)

    let form = new Form("survey")
    form.addQuestion("1. In your opinion, what efffect or relationship is shown in the data mini-story?")
    form.addQuestion("2. Which group did you pay the most attention to in this data mini-story?")
    form.setNextPage("causes.html")
    form.setLogger(d.logger)
    form.draw()
    
    graphs[0].draw()
    graphs[1].draw()
    scrollIndicator.draw()
})
