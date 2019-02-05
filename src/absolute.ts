import {demographicsGraph, ageDifferencesGraph} from './graphs'
import {SkelettonDecorator} from './Graph'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'


Promise.all([demographicsGraph(), ageDifferencesGraph()]).then( graphs => {
    const d = new Director()

    let morph = new MorphingGraph("demographics-differences")
    morph.setOrigin(graphs[0]) // demographics
    morph.setTarget(graphs[1]) // differences
    morph.addTransition("popshare25", "Rate_25")
    morph.addTransition("popshare25_44", "Rate25_44")
    morph.addTransition("popshare45_54", "Rate45_54")
    morph.addTransition("popshare55_64", "Rate55_64")
    morph.addTransition("popshare65_74", "Rate65_74")
    morph.addTransition("popshare75", "Rate75_84")
    morph.addTransition("popshare75", "Rate85up")


    let differencesEmpty = new SkelettonDecorator(
        graphs[1].cloneWithNewName("differences-empty")
    )

    // Storyboard
    d.addStep(-200, 10000, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(-200, 800, differencesEmpty)
    d.addStep(40, 800, morph)
    d.addStep(800, 10000, graphs[1])
    

    let form = new Form("survey")
    form.addQuestion("1. In your opinion, what effect or relationship is shown in the data mini-story?")
    form.addQuestion("2. Which group did you pay the most attention to in this data mini-story?")
    form.addChoice("3. Overall, was this data mini-story shown in a visually nice way?", ["Yes", "No"])
    form.setNextPage("relative.html")
    form.setLogger(d.logger)
    form.draw()    


    graphs[0].draw()
    scrollIndicator.draw()
    differencesEmpty.draw()
})
