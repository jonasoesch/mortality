export class Mark {
    name:string = ""
    color:string = "pink"
    label:string = ""
    labelOffsets:number[] = [0, 0]

    from:string
    to:string

    constructor(name="No name") {
        this.name = name 
    }


}
