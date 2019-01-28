import {genderGraph, demographicsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraph, MorphingGraphWithLabels} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

Promise.all([genderGraph(), demographicsGraph()]).then(graphs => {
   graphs[0].draw()
   graphs[1].draw()
})
