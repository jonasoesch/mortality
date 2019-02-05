import {uptickGraph, aidsGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {

    const d = new Director()

    const highlightMiddleAge = graphs[0].cloneWithNewName("highlight")
    highlightMiddleAge.removeMark("Rate85up")
    highlightMiddleAge.removeMark("Rate75_84")
    highlightMiddleAge.removeMark("Rate65_74")
    highlightMiddleAge.removeMark("Rate55_64")
    highlightMiddleAge.removeMark("Rate45_54")
    highlightMiddleAge.removeMark("Rate_25")
    d.addStep(1800, 2000, highlightMiddleAge) 

    const morph = new MorphingGraph("uptick-aids")
    morph.setOrigin(highlightMiddleAge) // uptick
    morph.setTarget(graphs[1]) // aids
    morph.addTransition("Rate25_44", "Other")
    morph.addTransition("Rate25_44", "Cancer")
    morph.addTransition("Rate25_44", "Heart")
    morph.addTransition("Rate25_44", "LiverKidneyPancreas")
    morph.addTransition("Rate25_44", "Suicide")
    morph.addTransition("Rate25_44", "Vehicle")
    morph.addTransition("Rate25_44", "Homicide")
    morph.addTransition("Rate25_44", "Respiratory")
    morph.addTransition("Rate25_44", "Drug_induced")
    morph.addTransition("Rate25_44", "AIDS")


    // Storyboard
    d.addStep(-200, 50, graphs[0])
    d.addStep(-200, 40, scrollIndicator)
    d.addStep(50, 200, highlightMiddleAge)
    d.addStep(200, 500, morph)
    d.addStep(500, 10000, graphs[1])
    

    d.drawAll(0)

    questionnaire(d, "demographics.html").draw() 
})
