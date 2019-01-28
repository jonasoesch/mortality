import {uptickGraph, aidsGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels, MorphingGraph} from './MorphingGraph'
import {scrollIndicator} from './scrollIndicator'

Promise.all([uptickGraph(), aidsGraph()]).then(graphs => {
    graphs[0].draw()
    graphs[1].draw()
})
