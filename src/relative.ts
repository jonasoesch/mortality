import {ageDifferencesGraph, uptickGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {SkelettonDecorator} from './Graph'
import {MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    const d = new Director()


    let morph = new MorphingGraphWithLabels("differences-uptick")
    morph.setOrigin(graphs[0]) // differences
    morph.setTarget(graphs[1]) // uptick
    morph.addTransition("Rate_25"  , "Rate_25"  ).setLabel("Under 25")
    morph.addTransition("Rate25_44", "Rate25_44").setLabel("25–44")
    morph.addTransition("Rate45_54", "Rate45_54").setLabel("45–54")
    morph.addTransition("Rate55_64", "Rate55_64").setLabel("55–64")
    morph.addTransition("Rate65_74", "Rate65_74").setLabel("65-74")
    morph.addTransition("Rate75_84", "Rate75_84").setLabel("75–84")
    morph.addTransition("Rate85up" , "Rate85up" ).setLabel("Over 84")

    let uptickEmpty = new SkelettonDecorator(
        graphs[1].cloneWithNewName("uptick-empty")
    )


    d.addStep(-200, 10000, graphs[0])
    d.addStep(-200, 800, uptickEmpty)
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(40, 800, morph)
    d.addStep(800, 10000, graphs[1])

    questionnaire(d, "causes.html").draw() 

    graphs[0].draw()
    scrollIndicator.draw()
    uptickEmpty.draw()
})
