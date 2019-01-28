import {demographicsGraph, ageDifferencesGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'


Promise.all([demographicsGraph(), ageDifferencesGraph()]).then( graphs => {
    graphs[0].draw()
    graphs[1].draw()
})
