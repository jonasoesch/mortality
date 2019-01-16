/**
 * This is a data class to keep together the graphical properties 
 * of a mark. A mark can be a line or an area or a point in a graph
**/


export class Mark {
    private _name:string = ""
    private _color:string = "pink"
    private _label:string = ""
    private _labelOffsets:number[] = [0, 0]


    constructor(name="No name") {
        this._name = name 
    }

    /**
     * The *name* of the mark is used to link it to a column in the data.
     * For example: the mark with the name "MortalityWomen" is used to
     * style the line for the column "MortalityWomen" in the dataset:
     *
     * | date | MortalityEveryone | MortalityMen | MortalityWomen |
     * | ---- | ----------------- | ------------ | -------------- |
     * | 1978 | 1001              | 1200         | 930            |
     **/
    get name():string {
        return this._name
    }

    set name(name:string) {
        this._name = name 
    }

    /** This method can be chained like this `mark.setName('name').setColor('red')` etc. **/
    setName(name):Mark {
        this.name = name
        return this
    }

    get color():string {
        return this._color
    }

    set color(color:string) {
        this._color = color 
    }

    /** This method can be chained like this `mark.setColor('red').setLabel('Label')` etc. **/
    setColor(color:string):Mark {
        this.color = color 
        return this
    }

    get label():string {
        return this._label
    }

    set label(label:string) {
        this._label = label
    }

    /** This method can be chained like this `mark.setLabel('Label').setLabelOffsets([0,0])` etc. **/
    setLabel(label:string):Mark {
        this.label = label 
        return this
    }

    get labelOffsets():number[] {
        return this._labelOffsets
    }
    set labelOffsets(labelOffsets:number[]){
        this._labelOffsets = labelOffsets 
    }

    /** This method can also be chained: `mark.setLabelOffsets([0,0]).setLabel("Another label")` etc. **/
    setLabelOffsets(labelOffsets:number[]):Mark {
        this.labelOffsets = labelOffsets
        return this
    }


}


export class MorphingMark extends Mark {
    from:string
    to:string
}
