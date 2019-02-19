import {uptickGraph, aidsGraph, questionnaire} from './graphs'
import {SkelettonDecorator} from './Graph'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()


    const linesRight = graphs[0].cloneWithNewName('lines-right')

    const move =  new MorphingGraphWithLabels("move-lines")
    move.setOrigin(graphs[0])
    move.setTarget(linesRight)
    move.addTransition("Rate25_44", "Rate25_44").setLabel("25–44")


    const morph = new MorphingGraph("uptick-aids")
    morph.setOrigin(linesRight) 
    morph.setTarget(graphs[1]) // aids
    morph.addTransition("Rate25_44", "Other"              )
    morph.addTransition("Rate25_44", "Cancer"             )
    morph.addTransition("Rate25_44", "Heart"              )
    morph.addTransition("Rate25_44", "LiverKidneyPancreas")
    morph.addTransition("Rate25_44", "Suicide"            )
    morph.addTransition("Rate25_44", "Vehicle"            )
    morph.addTransition("Rate25_44", "Homicide"           )
    morph.addTransition("Rate25_44", "Respiratory"        )
    morph.addTransition("Rate25_44", "Drug_induced"       )
    morph.addTransition("Rate25_44", "AIDS"               )


    let aidsEmpty = new SkelettonDecorator(
        graphs[1].cloneWithNewName("aids-empty")
    )

    // Storyboard
    d.addStep(-200, 10000, graphs[0])
    d.addStep(-200, 900, aidsEmpty)
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(40, 450, move)
    d.addStep(450, 900, morph)
    d.addStep(900, 10000, graphs[1])


    questionnaire(d, "https://weinberg.co1.qualtrics.com/jfe/form/SV_5B8UVBdKIWKK32d").draw() 

    graphs[0].draw()
    scrollIndicator.draw()
    aidsEmpty.draw()
})
