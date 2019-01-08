import * as intro from './intro';
import * as decrease from './decrease';
import * as older from './older';
import * as uptick from './uptick';
import * as aids from './aids';

let graphPromises = []
graphPromises.push(decrease.graph())
graphPromises.push(older.graph())
graphPromises.push(uptick.graph())
graphPromises.push(aids.graph())

Promise.all(graphPromises).then( (graphs) => {
console.log(graphs)
graphs.forEach( graph => graph.draw() )

})
