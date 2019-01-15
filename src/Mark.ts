/*
 * This is a data class to keep together the graphical properties 
 * of a mark. A mark can be a line or an area or a point in a graph
 */


export class Mark {
    _name:string = ""
    _color:string = "pink"
    _label:string = ""
    _labelOffsets:number[] = [0, 0]

    from:string
    to:string

    constructor(name="No name") {
        this._name = name 
    }

    get name():string {
        return this._name
    }

    set name(name:string) {
        this._name = name 
    }

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

    setLabelOffsets(labelOffsets:number[]):Mark {
        this.labelOffsets = labelOffsets
        return this
    }


}
