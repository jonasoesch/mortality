# Design decisions

## Goal

This document outlines the reasoning process behind the design decisions of the experimental setup.

## Log

### Dimensions

The dimensions of the visualizations should be fixed. No participant will therefore see more or less details than another based on differing browser window sizes.

At the beginning of the experiment, the browser window dimensions are checked. Participants with window sizes that are not large enough to show enough content are excluded from the experiment.

As per January 2019, at least 83% of desktop website visitors worldwide have screen resolutions wider then 1280px and higher than 720px. This will therefore be the target resolution of the experiment. [^Statcounter]


[^Statcounter]: Statcounter, "Desktop Screen Resolution Stats Worldwide", http://gs.statcounter.com/screen-resolution-stats/desktop/worldwide, Accessed: 2018-01-03

## Design

The design is based on the original story that appeared on Bloomberg online.


### Labels

Differing from the original design, the labels have been moved next to the element that they describe. The reasoning is, that it's easier to see for the reader what is what.

### Evolution of age groups

The original version only shows the top three age groups (75+, 65-74 and 55-64). Because the experiment will relate the visualizations more strongly to each other than the Bloomberg story, we have decided to display the same age groups in this graphic as in the succeeding visualization.

### Axes

Compared to the Bloomberg version, the y-axes consequently start at 0. It is quite well reasearched, that readers easily miss it when axes don't start at 0 and get the wrong impression of the data. (sources)


## Reviews

## Informal test of superposed transition

Test subject: Simon Marcin
Tag: test_1
Scenario: Superposed

The transition between "Mortality Everyone" and demographics over time is not clear. The reader didn't understand that the second graph showed in a way the composition of the line "Mortality Everyone". A proposed improvement was to show labels longer during transitions.


## Informal test of static and superposed scenarios

Test subject: Simon Schubiger
Tag: test_2
Scenario: Static and Superposed

The relationship between "Mortality Everyone" and demographics over time was not clear in both scenarios. The reader suspected that it was because the transition between "Deaths per 100'000" and the stacked area percentage chart was conceptually difficult. The proposition was to include an intermediary step. For example by moving the line "Mortality Everyone" to the top (representing 100%) and then extending it downwards.

It was also mentioned that the decomposition of Mortality into Demographics is not precise. Because the Mortality is actually composed by demographics and the respective mortality by age group.

## Sources

[^Bloomberg]: Matthew C. Klein, "How Americans Die", Bloomberg Visual Data, 2014-04-17 "
[^CDCP]: Centers for Disease Control and Prevention, National Center for Health Statistics. Compressed Mortality File 1968-1978. CDC WONDER Online Database, compiled from Compressed Mortality File CMF 1968-1988, Series 20, No. 2A, 2000. Accessed at http://wonder.cdc.gov/cmf-icd8.html on Jan 7, 2019 8:28:10 AM
* https://ourworldindata.org/why-do-women-live-longer-than-men
