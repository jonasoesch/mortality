import {genderGraph, demographicsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

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
            MortalityEveryone: 1100,
            }
        })
    )

    /* 
     * Create the two morphing graphs
     */
    let morphHighlight = new MorphingGraphWithLabels('gender-highlight')
    morphHighlight.setOrigin(graphs[0])
    morphHighlight.setTarget(highlight)
    morphHighlight.addTransition("MortalityEveryone", "MortalityEveryone").setLabel("Everyone")


    let morphDemographics = new MorphingGraph('highlight-demographics')
    morphDemographics.setOrigin(highlight)
    morphDemographics.setTarget(graphs[1])
    morphDemographics.addTransition("MortalityEveryone", "popshare25")
    morphDemographics.addTransition("MortalityEveryone", "popshare25_44")
    morphDemographics.addTransition("MortalityEveryone", "popshare45_54")
    morphDemographics.addTransition("MortalityEveryone", "popshare55_64")
    morphDemographics.addTransition("MortalityEveryone", "popshare65_74")
    morphDemographics.addTransition("MortalityEveryone", "popshare75")



    // Storyboard
    d.addStep(-200, 50, graphs[0]) // gender
    d.addStep(-200, 20, scrollIndicator)
    d.addStep(50, 300, morphHighlight) // highlight everyone
    d.addStep(300, 500, morphDemographics) // fan out into demographics
    d.addStep(500, 10000, graphs[1]) // demographics

   graphs[0].draw()
   graphs[1].draw()
})
