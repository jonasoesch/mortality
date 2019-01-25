import * as d3 from 'd3'
import {Graph} from './Graph'


let indicator = {
    draw: function() {
        if(d3.select(".scroll-indicator").size() === 0) {
            d3.select("article").append("div").attr("class", "scroll-indicator").html("Scroll down")
        }
        d3.select(".scroll-indicator").transition().duration(100).style("opacity", 1)
    },
    hide: function() {d3.select(".scroll-indicator").transition().duration(100).style("opacity", 0)}
}

export const scrollIndicator = <Graph>indicator
