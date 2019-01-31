import {ageDifferencesGraph, uptickGraph} from './graphs'
import {Director} from './Director'
import {MorphingGraphWithLabels} from './MorphingGraph'

Promise.all([ageDifferencesGraph(), uptickGraph()]).then(graphs => {
    graphs[0].draw()
    graphs[1].draw()
})
