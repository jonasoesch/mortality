export class Logger {
    messages:Message[]
    session:string
    user:string
    ua:string
    url:string
    screenWidth: number
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    pixelRatio: number


    waitingForActionSince:number

    constructor() {
        this.ua = window.navigator.userAgent
        this.screenWidth = window.screen.width
        this.screenHeight = window.screen.height
        this.url = window.location.href
        this.pixelRatio = window.devicePixelRatio
        this.user = this.getUser()
        this.session = this.uuid()
        this.messages = []

        this.waitingForActionSince = 0


        this.init()
        this.send()
    }

    getUser() {
        if(!this.getCookie('user')) {
            console.log("nope", this.getCookie('user'))
            this.setCookie('user', this.uuid())
        } 
        console.log("yep", this.getCookie('user'))
        return this.getCookie('user') 
    }

    private uuid() {
        return Date.now() + "-" + Math.random().toString(36).replace(";", "a").replace("=", "b") 
    }


    private getCookie(name:string):string {
        var re = new RegExp(name + "=([^;]+)");
        var value = re.exec(document.cookie);
        return (value != null) ? unescape(value[1]) : null;
    }

    private setCookie(key:string, value:string) {
        document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`; 
    }

    public animation(name:string, position:number) {
        this.waitIsOver()
        this.messages.push({
            timestamp: Date.now(),
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            name: name,
            position: position,
        }) 
    }

    public alive() {
        if(!this.waitMore()) {return}
        this.messages.push({
            timestamp: Date.now(),
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            name: '@alive',
            position: -1,
        }) 
    }

    private waitMore() {
        this.waitingForActionSince = this.waitingForActionSince + 20
        return this.waitingForActionSince < 120 // don't wait more than 2 min
    }

    private waitIsOver() {
        this.waitingForActionSince = 0 
    }

    public init() {
        this.messages.push({
            timestamp: Date.now(),
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            name: '@init',
            position: -1,
        }) 
    }


    public toString() {
        // timestamp, user, session, scroll 
        let out = ""
        this.messages.forEach( (m) => {
            out = out + this.wrap( m.timestamp       ) + ","
            out = out + this.wrap( this.url          ) + ","
            out = out + this.wrap( this.user         ) + ","
            out = out + this.wrap( this.session      ) + ","
            out = out + this.wrap( this.ua           ) + ","
            out = out + this.wrap( this.screenWidth  ) + ","
            out = out + this.wrap( this.screenHeight ) + ","
            out = out + this.wrap( m.windowWidth     ) + ","
            out = out + this.wrap( m.windowHeight    ) + ","
            out = out + this.wrap( this.pixelRatio   ) + ","
            out = out + this.wrap( m.name           ) + ","
            out = out + this.wrap( m.position        ) + "\n"
        })
        return out
    }


    public wrap(str, into='"') {
        return  into+str+into
    }

    public send() {
        if(this.messages.length === 0) {return}
        const body = this.toString()
        console.log(body)
        fetch("__API_URL__", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body,
        });
        this.messages = []
    }

}

interface Message {
    timestamp: number
    windowWidth: number
    windowHeight: number
    name:string
    position:number
}
