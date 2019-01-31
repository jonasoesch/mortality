export class Logger {
    messages:Message[]
    session:string
    user:string
    ua:string
    screenWidth: number
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    pixelRatio: number

    constructor() {
        this.ua = window.navigator.userAgent
        this.screenWidth = window.screen.width
        this.screenHeight = window.screen.height
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.pixelRatio = window.devicePixelRatio
        this.user = this.getUser()
        this.session = this.uuid()
        this.messages = []
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

    public scroll(position:number) {
       this.messages.push({
            timestamp: Date.now(),
            position: position
       }) 
    }

    public toString() {
        // timestamp, user, session, scroll 
        let out = ""
        this.messages.forEach( (m) => {
            out = out + m.timestamp + ","
            out = out + this.user + ","
            out = out + this.session + ","
            out = out + m.position + "\n"
        })
        return out
    }

    public send() {
        const body = this.toString()
        console.log(body)
        fetch('http://localhost:5000', {
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
    position: number
}
