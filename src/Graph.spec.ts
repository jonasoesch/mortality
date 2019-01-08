import 'jest';
import {Graph} from './Graph';



let g = new Graph("Jonas")

test('name', () => {
    expect(g.name).toBe("Jonas")
});


test('scales', () => {
    g.setScales(
        [new Date(Date.parse("2000-01-10")), new Date(Date.parse("2018-11-20"))],
        [0, 1]
    )
    expect(g.xScale(Date.parse("2005-03-20"))).toEqual(388.24793148497605)
    expect(g.yScale(0.5)).toEqual(360)
});

