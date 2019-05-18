import {genderGraph, demographicsGraph, questionnaire} from './graphs'
import {Director} from './Director'
import {SkelettonDecorator} from './Graph'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'
import {Form} from './Form'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
    let d = new Director()

    /*
     * Create the intermediate graph to hide
     * the gender specific marks and
     * morph the line to the top
     */
    let highlight = graphs[0].cloneWithNewName("highlight")
    highlight.removeMark("MortalityFemales")
    highlight.removeMark("MortalityMales")
    highlight.setData(
        highlight.data.map(d => { 
            return {
                date: d["date"],
                MortalityEveryone: 1120,
            }
        })
    )


    let highlightRight = highlight.cloneWithNewName('highlight-right')

    /* 
     * Create the two morphing graphs
     */
    let morphHighlight = new MorphingGraphWithLabels('gender-highlight')
    morphHighlight.setOrigin(graphs[0])
    morphHighlight.setTarget(highlight)
    morphHighlight.addTransition("MortalityEveryone", "MortalityEveryone").setLabel("Everyone")


    let moveHighlight = new MorphingGraphWithLabels('move-highlight')
    moveHighlight.setOrigin(highlight)
    moveHighlight.setTarget(highlightRight)
    moveHighlight.addTransition('MortalityEveryone', 'MortalityEveryone').setLabel("Everyone")


    let morphDemographics = new MorphingGraph('highlight-demographics')
    morphDemographics.setOrigin(highlightRight)
    morphDemographics.setTarget(graphs[1])
    morphDemographics.addTransition("MortalityEveryone", "popshare25")
    morphDemographics.addTransition("MortalityEveryone", "popshare25_44")
    morphDemographics.addTransition("MortalityEveryone", "popshare45_54")
    morphDemographics.addTransition("MortalityEveryone", "popshare55_64")
    morphDemographics.addTransition("MortalityEveryone", "popshare65_74")
    morphDemographics.addTransition("MortalityEveryone", "popshare75")


    let emptyDemographics = new SkelettonDecorator(
        graphs[1].cloneWithNewName("empty-demographics")
    )


    // Storyboard
    d.addStep(-200, 10000, graphs[0]) // gender
    d.addStep(-200, 1200, emptyDemographics)
    d.addStep(-200, 20, scrollIndicator)
    d.addStep(20, 220, morphHighlight) // highlight everyone
    d.addStep(200, 600, moveHighlight) // move highlight to the right
    d.addStep(600, 1200, morphDemographics) // fan out into demographics
    d.addStep(1200, 10000, graphs[1]) // demographics


    questionnaire(d, 1400, "https://www.cs.technik.fhnw.ch/lostintransition/").draw() 

    graphs[0].draw()
    scrollIndicator.draw()
    emptyDemographics.draw()
})
